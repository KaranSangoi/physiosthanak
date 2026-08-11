import { NextRequest, NextResponse } from 'next/server';

// Instant Telegram alert for website form submissions.
// Fires the moment a lead submits — independent of the Web3Forms email
// and the Notion Outbox cron (leads can't wait for a cron window).
// Env: TELEGRAM_BOT_TOKEN (secret, Vercel env only). Chat ID is not a secret.

export const runtime = 'nodejs';

const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1683559324';
// "PhysioSthanak HQ" forum group — leads go to the 🚨 Leads topic (thread 2).
const GROUP_ID = process.env.TELEGRAM_GROUP_ID || '';
const TOPIC_LEADS = 2;

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: 'not configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  // Honeypot: real forms always send botcheck as an empty string.
  if (typeof body.botcheck === 'string' && body.botcheck !== '') {
    return NextResponse.json({ ok: true });
  }

  const name = typeof body.name === 'string' ? body.name.slice(0, 100).trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.slice(0, 30).trim() : '';
  const email = typeof body.email === 'string' ? body.email.slice(0, 100).trim() : '';
  const service = typeof body.service === 'string' ? body.service.slice(0, 60).trim() : '';
  const message = typeof body.message === 'string' ? body.message.slice(0, 500).trim() : '';
  const page = typeof body.page === 'string' ? body.page.slice(0, 120).trim() : '';

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });
  }

  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const waPhone = cleanPhone.startsWith('+')
    ? cleanPhone.slice(1)
    : cleanPhone.length === 10
      ? `91${cleanPhone}`
      : cleanPhone;

  const lines = [
    '🚨 <b>NEW WEBSITE LEAD</b>',
    '',
    `👤 <b>${esc(name)}</b>`,
    `📞 ${esc(phone)} — tap to call: +${waPhone}`,
    email ? `✉️ ${esc(email)}` : '',
    service ? `🩺 Service: ${esc(service)}` : '',
    message ? `💬 "${esc(message)}"` : '',
    page ? `📄 From: ${esc(page)}` : '',
    '',
    `↩️ Reply now: https://wa.me/${waPhone}`,
  ].filter(Boolean);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(GROUP_ID
          ? { chat_id: GROUP_ID, message_thread_id: TOPIC_LEADS }
          : { chat_id: CHAT_ID }),
        text: lines.join('\n'),
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json();
    return NextResponse.json({ ok: !!data.ok });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
