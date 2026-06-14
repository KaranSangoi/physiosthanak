import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// AI bot user-agent patterns for GEO/AEO monitoring
const AI_BOT_PATTERNS: { pattern: RegExp; name: string }[] = [
  { pattern: /GPTBot/i, name: 'GPTBot' },
  { pattern: /ChatGPT-User/i, name: 'ChatGPT-User' },
  { pattern: /OAI-SearchBot/i, name: 'OAI-SearchBot' },
  { pattern: /PerplexityBot/i, name: 'PerplexityBot' },
  { pattern: /ClaudeBot/i, name: 'ClaudeBot' },
  { pattern: /Google-Extended/i, name: 'Google-Extended' },
  { pattern: /Applebot-Extended/i, name: 'Applebot-Extended' },
  { pattern: /Bytespider/i, name: 'Bytespider' },
  { pattern: /CCBot/i, name: 'CCBot' },
  { pattern: /GoogleOther/i, name: 'GoogleOther' },
  { pattern: /anthropic-ai/i, name: 'anthropic-ai' },
];

function detectAIBot(userAgent: string): string | null {
  for (const bot of AI_BOT_PATTERNS) {
    if (bot.pattern.test(userAgent)) {
      return bot.name;
    }
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- AI Bot Detection (fire-and-forget, non-blocking) ---
  const userAgent = request.headers.get('user-agent') || '';
  const botName = detectAIBot(userAgent);
  if (botName && !pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
    // Fire-and-forget: log the bot visit without awaiting
    const origin = request.nextUrl.origin;
    try {
      fetch(`${origin}/api/bot-monitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_name: botName,
          user_agent: userAgent.substring(0, 500),
          path: pathname,
        }),
      }).catch(() => {
        // Silently ignore — must never block the request
      });
    } catch {
      // Silently ignore
    }
  }

  // --- Admin route protection ---
  if (pathname.startsWith('/admin')) {
    // Always refresh the Supabase session for admin routes
    const response = await updateSession(request);

    // Protect /admin/* routes (except /admin/login)
    if (pathname !== '/admin/login') {
      const hasAuthCookie = request.cookies.getAll().some(
        (cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
      );

      if (!hasAuthCookie) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match admin routes
    '/admin/:path*',
    // Match all public pages for bot detection (exclude static assets and Next.js internals)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|txt|xml|json)).*)',
  ],
};
