import { NextResponse } from 'next/server';

// Vercel Cron Job: Reads Director's Brief + Content Calendar → sends daily digest to Telegram
// Runs daily at 2 PM IST (8:30 UTC) on Vercel infrastructure
// Data sources: Director's Brief (department health), Content Calendar DB (pipeline counts)

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1683559324';
const DIRECTORS_BRIEF_PAGE_ID = '34caf2b61f0f818cbd70e4715b6ea038';
const CONTENT_CALENDAR_DB_ID = '79a89ed233dd4263b092138312e7a2b2';

let lastSentDate = '';

// ── Telegram ──────────────────────────────────────────────

async function sendTelegram(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN not set');
    return false;
  }
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      },
    );
    if (!resp.ok) {
      const body = await resp.text();
      console.error(`Telegram API error: ${resp.status} - ${body}`);
    }
    return resp.ok;
  } catch (err) {
    console.error('Telegram send failed:', err);
    return false;
  }
}

// ── Notion: Read Director's Brief blocks ──────────────────

interface DepartmentHealth {
  name: string;
  status: string; // 🟢 🟡 🔴
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

    // Extract all text content from blocks
    const allText: string[] = [];
    for (const block of blocks) {
      const text = extractBlockText(block);
      if (text) allText.push(text);
    }

    const fullText = allText.join('\n');

    // Parse department health from the table pattern
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

    // If regex didn't work, try simpler extraction
    if (departments.length === 0) {
      // Fallback: look for emoji + department name patterns
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

    // Extract blocked items (lines with 🔴 in the blocked section)
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

    // Extract last session info
    const sessionMatch = fullText.match(/Last Session[^\n]*Date:\s*([^|]+)/);
    const lastSession = sessionMatch ? sessionMatch[1].trim() : '';

    // Extract phase info
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
    // Handle table rows
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
    // Query the Content Calendar database
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

  // Department health
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

  // Content pipeline (live from database)
  if (pipeline.total > 0) {
    msg += `📝 <b>Content Pipeline:</b>\n`;
    if (pipeline.creativeReady > 0) msg += `  ✅ ${pipeline.creativeReady} Creative Ready\n`;
    if (pipeline.goAhead > 0) msg += `  🟢 ${pipeline.goAhead} Go Ahead\n`;
    if (pipeline.underReview > 0) msg += `  🟡 ${pipeline.underReview} Under Review\n`;
    if (pipeline.needFixes > 0) msg += `  🔧 ${pipeline.needFixes} Need Fixes\n`;
    if (pipeline.posted > 0) msg += `  📱 ${pipeline.posted} Posted\n`;
    msg += '\n';
  }

  // Blocked items
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

// ── GET handler ───────────────────────────────────────────

export async function GET(request: Request) {
  // Verify cron secret
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

  // Get today's date for dedup (IST)
  const now = new Date();
  const istDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const today = istDate.toISOString().split('T')[0];

  if (today === lastSentDate) {
    return NextResponse.json({ status: 'skip', reason: 'Already sent today' });
  }

  // Fetch data from both sources in parallel
  const [briefData, pipelineData] = await Promise.all([
    fetchDirectorsBrief(notionToken),
    fetchContentPipeline(notionToken),
  ]);

  // Even if briefData is null, we can still send pipeline info
  if (!briefData && pipelineData.total === 0) {
    const fallback = `📊 <b>PhysioSthanak Daily</b>\n\n⚠️ Could not read Notion data. Check if NOTION_TOKEN is valid and Director's Brief exists.`;
    await sendTelegram(fallback);
    lastSentDate = today;
    return NextResponse.json({ status: 'sent', type: 'fallback' });
  }

  // Format and send
  const message = formatDailyDigest(briefData, pipelineData);
  const sent = await sendTelegram(message);

  if (sent) {
    lastSentDate = today;
    return NextResponse.json({
      status: 'sent',
      departments: briefData?.departments.length || 0,
      pipelineTotal: pipelineData.total,
    });
  }

  return NextResponse.json({ status: 'error', reason: 'Telegram send failed' }, { status: 500 });
}
