import { NextResponse } from 'next/server';

// Force dynamic — NEVER cache this route. It must execute fresh every time.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
// Multi-message runs (Notion reads + several sends + paced deletes) can exceed
// the default 10s function limit — allow up to 60s.
export const maxDuration = 60;

// Vercel Cron Job: Two responsibilities:
// 1. Daily digest: Reads Director's Brief + Content Calendar → sends summary (once/day at ~2PM IST)
// 2. Outbox relay: Reads Notion "Telegram Outbox" page → sends any pending messages from scheduled tasks
// Runs every 4 hours. Scheduled tasks can't reach Telegram API (sandbox proxy blocks it),
// so they write messages to the Notion outbox instead.

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1683559324';
const DIRECTORS_BRIEF_PAGE_ID = '34caf2b61f0f818cbd70e4715b6ea038';
const CONTENT_CALENDAR_DB_ID = '79a89ed233dd4263b092138312e7a2b2';
const TELEGRAM_OUTBOX_PAGE_ID = '356af2b61f0f81c7b02dc744f33fdf15';

let lastSentDate = '';

// ── Telegram ──────────────────────────────────────────────

interface SendResult {
  ok: boolean;
  status: number;
  desc: string;
  mode: 'html' | 'html-after-429' | 'plain-fallback' | 'error';
}

async function sendTelegramRaw(text: string): Promise<SendResult> {
  if (!TELEGRAM_BOT_TOKEN) {
    return { ok: false, status: 0, desc: 'TELEGRAM_BOT_TOKEN not set', mode: 'error' };
  }
  const call = (payload: Record<string, unknown>) =>
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  try {
    const resp = await call({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' });
    if (resp.ok) return { ok: true, status: 200, desc: 'ok', mode: 'html' };

    const body = await resp.text();
    console.error(`Telegram API error: ${resp.status} - ${body}`);
    let desc = body.slice(0, 160);
    try { desc = JSON.parse(body)?.description ?? desc; } catch { /* keep raw */ }

    // Rate limited — wait the requested time and retry once
    if (resp.status === 429) {
      let retryAfter = 5;
      try { retryAfter = JSON.parse(body)?.parameters?.retry_after ?? 5; } catch { /* default */ }
      await new Promise(r => setTimeout(r, Math.min(retryAfter, 30) * 1000 + 500));
      const retry = await call({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' });
      return { ok: retry.ok, status: retry.status, desc: retry.ok ? 'ok after 429' : desc, mode: 'html-after-429' };
    }
    // HTML parse failure (e.g. a tag broken by message splitting) — send plain
    if (resp.status === 400 && body.includes("can't parse")) {
      const retry = await call({ chat_id: TELEGRAM_CHAT_ID, text: text.replace(/<[^>]+>/g, '') });
      return { ok: retry.ok, status: retry.status, desc: retry.ok ? 'ok as plain text' : desc, mode: 'plain-fallback' };
    }
    return { ok: false, status: resp.status, desc, mode: 'error' };
  } catch (err) {
    return { ok: false, status: 0, desc: String(err).slice(0, 160), mode: 'error' };
  }
}

// Split long messages at line boundaries to stay under Telegram's 4096 char limit
function splitMessage(message: string, maxLen = 4000): string[] {
  if (message.length <= maxLen) return [message];

  const parts: string[] = [];
  let remaining = message;
  let partNum = 1;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      parts.push(remaining);
      break;
    }

    // Find a good split point (double newline, single newline, or last space)
    let splitAt = remaining.lastIndexOf('\n\n', maxLen);
    if (splitAt < maxLen * 0.3) splitAt = remaining.lastIndexOf('\n', maxLen);
    if (splitAt < maxLen * 0.3) splitAt = remaining.lastIndexOf(' ', maxLen);
    if (splitAt < maxLen * 0.3) splitAt = maxLen;

    parts.push(remaining.substring(0, splitAt).trimEnd());
    remaining = remaining.substring(splitAt).trimStart();
    partNum++;
  }

  // Balance <b>/<i> tags across split points so each part is valid HTML on its
  // own — otherwise Telegram rejects the part and it falls back to plain text.
  for (const tag of ['b', 'i']) {
    let carry = false;
    for (let i = 0; i < parts.length; i++) {
      if (carry) parts[i] = `<${tag}>` + parts[i];
      const opens = (parts[i].match(new RegExp(`<${tag}>`, 'g')) || []).length;
      const closes = (parts[i].match(new RegExp(`</${tag}>`, 'g')) || []).length;
      carry = opens > closes;
      if (carry) parts[i] = parts[i] + `</${tag}>`;
    }
  }

  // Add part labels if we split
  if (parts.length > 1) {
    return parts.map((p, i) => `${p}\n\n<i>(${i + 1}/${parts.length})</i>`);
  }
  return parts;
}

async function sendTelegram(message: string): Promise<{ ok: boolean; parts: SendResult[] }> {
  const parts = splitMessage(message);
  const results: SendResult[] = [];
  for (const part of parts) {
    results.push(await sendTelegramRaw(part));
    // Small delay between parts to avoid rate limits
    if (parts.length > 1) await new Promise(r => setTimeout(r, 500));
  }
  return { ok: results.every(r => r.ok), parts: results };
}

// ── Notion: Read Director's Brief blocks ──────────────────

interface DepartmentHealth {
  name: string;
  status: string;
  metric: string;
  priority: string;
}

interface DirectorsBriefData {
  departments: DepartmentHealth[];
  blocked: string[];
  lastSession: string;
  phase: string;
}

async function fetchDirectorsBrief(notionToken: string): Promise<DirectorsBriefData | null> {
  try {
    const resp = await fetch(
      `https://api.notion.com/v1/blocks/${DIRECTORS_BRIEF_PAGE_ID}/children?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
        },
      },
    );

    if (!resp.ok) {
      console.error(`Notion API error (Director's Brief): ${resp.status}`);
      return null;
    }

    const data = await resp.json();
    const blocks = data.results || [];

    const allText: string[] = [];
    for (const block of blocks) {
      const text = extractBlockText(block);
      if (text) allText.push(text);
    }

    const fullText = allText.join('\n');

    const departments: DepartmentHealth[] = [];
    const deptRows = [
      { name: 'SEO', pattern: /SEO & Website[^\n]*?([🟢🟡🔴])[^\n]*?\|([^|]+)\|([^\n]+)/ },
      { name: 'GBP', pattern: /Google Business Profile[^\n]*?([🟢🟡🔴])[^\n]*?\|([^|]+)\|([^\n]+)/ },
      { name: 'Instagram', pattern: /Instagram[^\n]*?([🟢🟡🔴])[^\n]*?\|([^|]+)\|([^\n]+)/ },
      { name: 'Marketing', pattern: /Marketing[^\n]*?([🟢🟡🔴])[^\n]*?\|([^|]+)\|([^\n]+)/ },
      { name: 'Operations', pattern: /Operations[^\n]*?([🟢🟡🔴])[^\n]*?\|([^|]+)\|([^\n]+)/ },
    ];

    for (const dr of deptRows) {
      const match = fullText.match(dr.pattern);
      if (match) {
        departments.push({
          name: dr.name,
          status: match[1],
          metric: match[2].trim(),
          priority: match[3].trim(),
        });
      }
    }

    if (departments.length === 0) {
      const lines = fullText.split('\n');
      for (const line of lines) {
        for (const deptName of ['SEO', 'GBP', 'Instagram', 'Marketing', 'Operations']) {
          if (line.includes(deptName)) {
            const emoji = line.match(/([🟢🟡🔴])/);
            if (emoji) {
              departments.push({
                name: deptName,
                status: emoji[1],
                metric: line.substring(line.indexOf(emoji[1]) + 2, Math.min(line.length, line.indexOf(emoji[1]) + 60)).trim(),
                priority: '',
              });
            }
          }
        }
      }
    }

    const blocked: string[] = [];
    const blockedSection = fullText.substring(fullText.indexOf('Blocked'));
    if (blockedSection) {
      const blockedLines = blockedSection.split('\n');
      for (const line of blockedLines) {
        if (line.includes('🔴') && line.length > 10 && line.length < 150) {
          const clean = line.replace(/🔴\s*\*\*/, '').replace(/\*\*/g, '').trim();
          if (clean) blocked.push(clean);
        }
      }
    }

    const sessionMatch = fullText.match(/Last Session[^\n]*Date:\s*([^|]+)/);
    const lastSession = sessionMatch ? sessionMatch[1].trim() : '';

    const phaseMatch = fullText.match(/Phase \d.*?(?:COMPLETE|starts|in progress)/i);
    const phase = phaseMatch ? phaseMatch[0].trim() : '';

    return { departments, blocked: blocked.slice(0, 3), lastSession, phase };
  } catch (err) {
    console.error('Failed to fetch Director\'s Brief:', err);
    return null;
  }
}

function extractBlockText(block: Record<string, unknown>): string {
  const blockType = block.type as string;
  if (!blockType) return '';

  const textTypes = ['heading_1', 'heading_2', 'heading_3', 'paragraph', 'bulleted_list_item', 'callout', 'quote'];
  if (!textTypes.includes(blockType)) {
    if (blockType === 'table_row') {
      const cells = (block.table_row as { cells?: Array<Array<{ plain_text?: string }>> })?.cells || [];
      return cells.map(cell =>
        cell.map((rt: { plain_text?: string }) => rt.plain_text || '').join('')
      ).join(' | ');
    }
    return '';
  }

  const content = block[blockType] as { rich_text?: Array<{ plain_text?: string }> } | undefined;
  const richTexts = content?.rich_text || [];
  return richTexts.map((rt: { plain_text?: string }) => rt.plain_text || '').join('');
}

// ── Notion: Query Content Calendar for pipeline counts ────

interface PipelineCounts {
  underReview: number;
  goAhead: number;
  creativeReady: number;
  needFixes: number;
  posted: number;
  total: number;
}

async function fetchContentPipeline(notionToken: string): Promise<PipelineCounts> {
  const counts: PipelineCounts = {
    underReview: 0, goAhead: 0, creativeReady: 0, needFixes: 0, posted: 0, total: 0,
  };

  try {
    const resp = await fetch(
      `https://api.notion.com/v1/databases/${CONTENT_CALENDAR_DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 100,
          filter: {
            property: 'Status',
            status: {
              does_not_equal: 'Done',
            },
          },
        }),
      },
    );

    if (!resp.ok) {
      console.error(`Notion DB query error: ${resp.status}`);
      return counts;
    }

    const data = await resp.json();
    const pages = data.results || [];

    for (const page of pages) {
      const status = page.properties?.Status?.status?.name || '';
      counts.total++;
      switch (status) {
        case 'Under Review': counts.underReview++; break;
        case 'Go Ahead': counts.goAhead++; break;
        case 'Creative Ready': counts.creativeReady++; break;
        case 'Need Fixes': counts.needFixes++; break;
        case 'Posted': counts.posted++; break;
      }
    }
  } catch (err) {
    console.error('Failed to query Content Calendar:', err);
  }

  return counts;
}

// ── Notion: Read & clear Telegram Outbox ─────────────────

interface OutboxMessage {
  blockIds: string[]; // every block belonging to this message (heading + content)
  text: string; // '' = nothing to send, blocks are just cleanup (orphan heading, divider, blank)
}

async function fetchOutboxMessages(notionToken: string): Promise<OutboxMessage[]> {
  const messages: OutboxMessage[] = [];

  try {
    const resp = await fetch(
      `https://api.notion.com/v1/blocks/${TELEGRAM_OUTBOX_PAGE_ID}/children?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
        },
      },
    );

    if (!resp.ok) {
      console.error(`Notion API error (Outbox): ${resp.status}`);
      return messages;
    }

    const data = await resp.json();
    const blocks = data.results || [];

    // Strategy: collect messages in two ways:
    // 1. Code blocks (original format — each code block = one message)
    // 2. Text blocks grouped by "Message —" headings (heading_3)
    //    Scheduled tasks may write as regular text instead of code blocks.
    //
    // IMPORTANT INVARIANT: a message's blocks (heading + content) live and die
    // TOGETHER. If a send fails, nothing is deleted and it retries next run.
    // Groups with no text (orphaned headings) are flushed as cleanup-only.

    let currentMessageBlocks: { ids: string[]; lines: string[] } | null = null;
    let inPendingSection = false;

    const flush = () => {
      if (currentMessageBlocks) {
        messages.push({
          blockIds: currentMessageBlocks.ids,
          text: currentMessageBlocks.lines.join('\n').trim(),
        });
        currentMessageBlocks = null;
      }
    };

    for (const block of blocks) {
      const blockType = block.type as string;
      const blockId = block.id as string;

      // Code blocks: standalone messages (original format)
      if (blockType === 'code') {
        flush();
        const codeBlock = block.code as { rich_text?: Array<{ plain_text?: string }> };
        const text = (codeBlock?.rich_text || [])
          .map((rt: { plain_text?: string }) => rt.plain_text || '')
          .join('');
        messages.push({ blockIds: [blockId], text: text.trim() });
        continue;
      }

      // Track "Pending Messages" section
      if (blockType === 'heading_2') {
        const h2Text = extractRichText(block.heading_2);
        if (h2Text.includes('Pending Messages')) {
          inPendingSection = true;
          continue;
        }
        // Any other h2 ends the pending section
        if (inPendingSection) {
          inPendingSection = false;
          flush();
        }
        continue;
      }

      if (!inPendingSection) continue;

      // Dividers end current message and pending section
      if (blockType === 'divider') {
        flush();
        messages.push({ blockIds: [blockId], text: '' });
        inPendingSection = false;
        continue;
      }

      // "Message —" heading starts a new message group
      if (blockType === 'heading_3') {
        const h3Text = extractRichText(block.heading_3);
        if (h3Text.toLowerCase().includes('message')) {
          flush();
          currentMessageBlocks = { ids: [blockId], lines: [] };
          continue;
        }
      }

      // Collect all blocks (even textless ones, for cleanup) into current message
      if (currentMessageBlocks) {
        currentMessageBlocks.ids.push(blockId);
        const text = extractBlockTextForOutbox(block);
        if (text) currentMessageBlocks.lines.push(text);
      }
    }

    // Flush final message
    flush();
  } catch (err) {
    console.error('Failed to fetch outbox:', err);
  }

  return messages;
}

function extractRichText(blockContent: { rich_text?: Array<{ plain_text?: string }> } | undefined): string {
  if (!blockContent?.rich_text) return '';
  return blockContent.rich_text.map((rt: { plain_text?: string }) => rt.plain_text || '').join('');
}

function extractBlockTextForOutbox(block: Record<string, unknown>): string {
  const blockType = block.type as string;
  const textTypes = ['paragraph', 'bulleted_list_item', 'numbered_list_item', 'heading_1', 'heading_2', 'heading_3', 'callout', 'quote', 'toggle'];

  if (textTypes.includes(blockType)) {
    const content = block[blockType] as { rich_text?: Array<{ plain_text?: string; annotations?: { bold?: boolean }; href?: string }> } | undefined;
    const richTexts = content?.rich_text || [];
    // Convert to simple text, preserving bold as <b> for Telegram HTML
    return richTexts.map((rt: { plain_text?: string; annotations?: { bold?: boolean }; href?: string }) => {
      let text = rt.plain_text || '';
      if (rt.annotations?.bold) text = `<b>${text}</b>`;
      return text;
    }).join('');
  }

  return '';
}

async function deleteBlock(notionToken: string, blockId: string): Promise<void> {
  try {
    await fetch(`https://api.notion.com/v1/blocks/${blockId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
      },
    });
  } catch (err) {
    console.error(`Failed to delete block ${blockId}:`, err);
  }
}

// ── Format the daily digest ───────────────────────────────

function formatDailyDigest(
  brief: DirectorsBriefData | null,
  pipeline: PipelineCounts,
): string {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  let msg = `<b>📊 PhysioSthanak Daily — ${today}</b>\n\n`;

  if (brief && brief.departments.length > 0) {
    for (const dept of brief.departments) {
      const metricShort = dept.metric.length > 50
        ? dept.metric.substring(0, 50) + '…'
        : dept.metric;
      msg += `${dept.status} <b>${dept.name}:</b> ${metricShort}\n`;
    }
    msg += '\n';
  } else {
    msg += `⚠️ Could not read department health from Director's Brief\n\n`;
  }

  if (pipeline.total > 0) {
    msg += `📝 <b>Content Pipeline:</b>\n`;
    if (pipeline.creativeReady > 0) msg += `  ✅ ${pipeline.creativeReady} Creative Ready\n`;
    if (pipeline.goAhead > 0) msg += `  🟢 ${pipeline.goAhead} Go Ahead\n`;
    if (pipeline.underReview > 0) msg += `  🟡 ${pipeline.underReview} Under Review\n`;
    if (pipeline.needFixes > 0) msg += `  🔧 ${pipeline.needFixes} Need Fixes\n`;
    if (pipeline.posted > 0) msg += `  📱 ${pipeline.posted} Posted\n`;
    msg += '\n';
  }

  if (brief && brief.blocked.length > 0) {
    msg += `⚡ <b>Needs your action:</b>\n`;
    for (const item of brief.blocked) {
      msg += `• ${item}\n`;
    }
    msg += '\n';
  } else {
    msg += `✅ No blockers right now.\n\n`;
  }

  msg += `<i>Auto from Notion · Director's Brief + Content Calendar</i>`;

  return msg;
}

// ── Check if it's daily digest time (around 2 PM IST) ────

function isDailyDigestTime(): boolean {
  const now = new Date();
  const istHour = new Date(now.getTime() + 5.5 * 60 * 60 * 1000).getUTCHours();
  // Cron runs every 4 hours (0,4,8,12,16,20 UTC = 5:30,9:30,13:30,17:30,21:30,1:30 IST)
  // Send daily digest on the 8 UTC run (1:30 PM IST — closest to 2 PM)
  return istHour >= 13 && istHour < 17;
}

// ── GET handler ───────────────────────────────────────────

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const url = new URL(request.url);
  const querySecret = url.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return NextResponse.json({ error: 'NOTION_TOKEN not configured' }, { status: 500 });
  }

  const results: { dailyDigest?: string; outbox?: string } = {};

  // ── 1. Process Telegram Outbox (every run) ──────────────
  const outboxMessages = await fetchOutboxMessages(notionToken);

  const details: Array<{ preview: string; parts: number; delivered: boolean; results: SendResult[] }> = [];
  if (outboxMessages.length > 0) {
    let sentCount = 0;
    let keptCount = 0;
    let cleanedCount = 0;
    for (const msg of outboxMessages) {
      if (msg.text) {
        // Real message — send via Telegram; delete ALL its blocks only on success.
        // On failure, keep everything intact so the next run retries it.
        const send = await sendTelegram(msg.text);
        details.push({
          preview: msg.text.slice(0, 60).replace(/\n/g, ' '),
          parts: send.parts.length,
          delivered: send.ok,
          results: send.parts,
        });
        if (send.ok) {
          for (const id of msg.blockIds) await deleteBlock(notionToken, id);
          sentCount++;
        } else {
          keptCount++;
        }
        // Pace sends — Telegram allows ~1 msg/sec per chat; bursts cause 429s
        await new Promise(r => setTimeout(r, 1200));
      } else {
        // Cleanup-only group (orphaned heading, divider, blank blocks)
        for (const id of msg.blockIds) await deleteBlock(notionToken, id);
        cleanedCount++;
      }
    }
    results.outbox = `${sentCount} sent, ${keptCount} kept for retry, ${cleanedCount} empty groups cleaned`;
  } else {
    results.outbox = 'no pending messages';
  }

  // ── 2. Daily Digest (once per day, afternoon IST) ───────
  const now = new Date();
  const istDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const today = istDate.toISOString().split('T')[0];

  if (isDailyDigestTime() && today !== lastSentDate) {
    const [briefData, pipelineData] = await Promise.all([
      fetchDirectorsBrief(notionToken),
      fetchContentPipeline(notionToken),
    ]);

    if (!briefData && pipelineData.total === 0) {
      const fallback = `📊 <b>PhysioSthanak Daily</b>\n\n⚠️ Could not read Notion data. Check if NOTION_TOKEN is valid.`;
      await sendTelegram(fallback);
      lastSentDate = today;
      results.dailyDigest = 'sent (fallback)';
    } else {
      const message = formatDailyDigest(briefData, pipelineData);
      const sent = await sendTelegram(message);
      if (sent) {
        lastSentDate = today;
        results.dailyDigest = 'sent';
      } else {
        results.dailyDigest = 'failed';
      }
    }
  } else {
    results.dailyDigest = today === lastSentDate ? 'already sent today' : 'not digest time';
  }

  return NextResponse.json({ status: 'ok', ...results, chatId: TELEGRAM_CHAT_ID, details }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
