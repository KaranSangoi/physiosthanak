import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use the service-level Supabase client (anon key with RLS INSERT policy)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bot_name, user_agent, path } = body;

    if (!bot_name || !user_agent || !path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate field lengths to prevent abuse
    if (bot_name.length > 100 || user_agent.length > 500 || path.length > 2000) {
      return NextResponse.json({ error: 'Field too long' }, { status: 400 });
    }

    const { error } = await supabase.from('bot_visits').insert({
      bot_name: String(bot_name),
      user_agent: String(user_agent).substring(0, 500),
      path: String(path).substring(0, 2000),
    });

    if (error) {
      console.error('Bot monitor insert error:', error.message);
      return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
