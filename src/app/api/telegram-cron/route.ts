import { NextResponse } from 'next/server';

// Vercel Cron Job: Reads Notion Automation Log → sends new entries to Telegram
// Runs on Vercel infrastructure, so it CAN reach api.telegram.org

const TELEGRAM_BOT_TOKEN = '8773156208:AAENy6szv7y5s28t7-aNBED9-mLsX1Y3h1A';
const TELEGRAM_CHAT_ID = '1683559324';
const AUTOMATION_LOG_PAGE_ID = '348af2b61f0f813c92bfd36527e60184';

// Simple in-memory dedup (resets on cold start, but that's fine for alerts)
// For persistence, we check the last entry timestamp
let lastSentKey = '';

async function sendTelegram(message: string): Promise<boolean> {
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
    return resp.ok;
  } catch {
    return false;
  }
}

async function fetchAutomationLog(notionToken: string): Promise<string> {
  try {
    const resp = await fetch(
      `https://api.notion.com/v1/blocks/${AUTOMATION_LOG_PAGE_ID}/children?page_size=50`,
      {
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
        },
      },
    );

    if (!resp.ok) {
      console.error(`Notion API error: ${resp.status}`);
      return '';
    }

    const data = await resp.json();
    const blocks = data.results || [];
    const textParts: string[] = [];

    for (const block of blocks) {
      const blockType = block.type;
      if (['heading_2', 'heading_3', 'paragraph', 'bulleted_list_item'].includes(blockType)) {
        const richTexts = block[blockType]?.rich_text || [];
        const line = richTexts.map((rt: { plain_text?: string }) => rt.plain_text || '').join('');
        if (line.trim()) {
          textParts.push(line.trim());
        }
      }
    }

    return textParts.join('\n');
  } catch (err) {
    console.error('Failed to fetch Notion:', err);
    return '';
  }
}

function extractLatestEntry(logText: string): { header: string; details: string; key: string } | null {
  const lines = logText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if ((line.includes('\u{1F7E2}') || line.includes('\u{1F534}')) && line.includes('|')) {
      const details = [line];
      for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
        if ((lines[j].includes('\u{1F7E2}') || lines[j].includes('\u{1F534}')) && lines[j].includes('|')) {
          break;
        }
        if (lines[j].trim()) {
          details.push(lines[j].trim());
        }
      }
      return {
        header: line.trim(),
        details: details.slice(0, 8).join('\n'),
        key: line.trim().substring(0, 60),
      };
    }
  }

  return null;
}

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    return NextResponse.json({ error: 'NOTION_TOKEN not configured' }, { status: 500 });
  }

  // Fetch Automation Log from Notion
  const logText = await fetchAutomationLog(notionToken);
  if (!logText) {
    return NextResponse.json({ status: 'skip', reason: 'No log content or API error' });
  }

  // Extract latest entry
  const entry = extractLatestEntry(logText);
  if (!entry) {
    return NextResponse.json({ status: 'skip', reason: 'No log entries found' });
  }

  // Dedup check
  if (entry.key === lastSentKey) {
    return NextResponse.json({ status: 'skip', reason: 'Already sent this entry' });
  }

  // Format and send to Telegram
  const message = `<b>\u{1F4CB} PhysioSthanak Automation Alert</b>\n\n${entry.details}`;
  const sent = await sendTelegram(message);

  if (sent) {
    lastSentKey = entry.key;
    return NextResponse.json({ status: 'sent', entry: entry.key });
  }

  return NextResponse.json({ status: 'error', reason: 'Telegram send failed' }, { status: 500 });
}
