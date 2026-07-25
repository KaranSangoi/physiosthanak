import { NextResponse } from 'next/server';

// Deprecated before launch (Jul 2026): auto-logging web enquiries to Notion
// was decided against — manual logging in the Ads Patient Log keeps a single,
// human-verified source of truth. Endpoint intentionally disabled.
// (File kept only because the environment could not delete it; safe to remove.)

export async function POST() {
  return NextResponse.json({ ok: false, reason: 'disabled' }, { status: 410 });
}
