// This API route is no longer used — PNG generation is now client-side via modern-screenshot
// Delete this file when convenient
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ error: 'Deprecated — using client-side rendering now' }, { status: 410 });
}
