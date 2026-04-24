import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get('page');
  if (!pageId) {
    return NextResponse.json({ error: 'Missing page parameter' }, { status: 400 });
  }

  try {
    // Dynamic import to avoid bundling Puppeteer in client
    const chromium = await import('@sparticuz/chromium');
    const puppeteer = await import('puppeteer-core');

    const executablePath = await chromium.default.executablePath();
    console.log('Chromium executable path:', executablePath);

    const browser = await puppeteer.default.launch({
      args: [...chromium.default.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1080, height: 1080 },
      executablePath,
      headless: 'shell' as any,
    });

    const page = await browser.newPage();

    // Use the request's own origin for self-referencing URL
    const baseUrl = request.nextUrl.origin;
    const renderUrl = `${baseUrl}/carousel/${pageId}?render=true`;
    console.log('Navigating to render URL:', renderUrl);

    await page.goto(renderUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);
    // Extra wait for any CSS transitions / images
    await new Promise(r => setTimeout(r, 2000));

    // Count how many render-slide elements exist
    const slideCount = await page.evaluate(() => {
      let count = 0;
      while (document.getElementById(`render-slide-${count}`)) count++;
      return count;
    });

    if (slideCount === 0) {
      await browser.close();
      return NextResponse.json({ error: 'No slides found on render page' }, { status: 500 });
    }

    // Screenshot each slide
    const images: string[] = [];
    for (let i = 0; i < slideCount; i++) {
      const element = await page.$(`#render-slide-${i}`);
      if (!element) continue;

      const screenshot = await element.screenshot({
        type: 'png',
        encoding: 'base64',
      });

      images.push(`data:image/png;base64,${screenshot}`);
    }

    await browser.close();

    return NextResponse.json({ images }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error('Carousel PNG generation error:', err.message, err.stack);
    return NextResponse.json(
      {
        error: `PNG generation failed: ${err.message}`,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}
