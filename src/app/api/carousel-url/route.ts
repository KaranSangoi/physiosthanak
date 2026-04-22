import { NextResponse } from 'next/server';

// API route to update Notion Content Calendar entries with carousel preview URLs
// Called after content is marked "Creative Ready"
// Usage: GET /api/carousel-url?secret=<CRON_SECRET>
//   → Finds all "Creative Ready" entries missing a Carousel Preview URL and adds it
// Usage: GET /api/carousel-url?secret=<CRON_SECRET>&page=<PAGE_ID>
//   → Updates a single page with its carousel preview URL

const CONTENT_CALENDAR_DB_ID = '79a89ed233dd4263b092138312e7a2b2';
const SITE_URL = 'https://physiosthanak.com';

async function notionRequest(endpoint: string, method: string, body?: object) {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error('NOTION_TOKEN not configured');

  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Notion API ${response.status}: ${text}`);
  }

  return response.json();
}

async function ensureCarouselProperty() {
  // Add "Carousel Preview" URL property to database (idempotent - Notion ignores if it exists)
  try {
    await notionRequest(`/databases/${CONTENT_CALENDAR_DB_ID}`, 'PATCH', {
      properties: {
        'Carousel Preview': { url: {} },
      },
    });
    return true;
  } catch (err) {
    console.error('Failed to add property:', err);
    return false;
  }
}

async function updatePageCarouselUrl(pageId: string): Promise<boolean> {
  const cleanId = pageId.replace(/-/g, '');
  const carouselUrl = `${SITE_URL}/carousel/${cleanId}`;

  try {
    await notionRequest(`/pages/${pageId}`, 'PATCH', {
      properties: {
        'Carousel Preview': {
          url: carouselUrl,
        },
      },
    });
    return true;
  } catch (err) {
    console.error(`Failed to update page ${pageId}:`, err);
    return false;
  }
}

async function findCreativeReadyPages(): Promise<Array<{ id: string; title: string }>> {
  const results: Array<{ id: string; title: string }> = [];

  try {
    const data = await notionRequest(`/databases/${CONTENT_CALENDAR_DB_ID}/query`, 'POST', {
      filter: {
        property: 'Status',
        select: {
          equals: 'Creative Ready',
        },
      },
    });

    for (const page of data.results || []) {
      const titleProp = page.properties?.['Content Idea'];
      const title = titleProp?.title?.map((t: { plain_text: string }) => t.plain_text).join('') || 'Untitled';

      // Check if Carousel Preview is already set
      const carouselProp = page.properties?.['Carousel Preview'];
      const existingUrl = carouselProp?.url;

      if (!existingUrl) {
        results.push({ id: page.id, title });
      }
    }
  } catch (err) {
    console.error('Failed to query database:', err);
  }

  return results;
}

export async function GET(request: Request) {
  // Auth check
  const url = new URL(request.url);
  const querySecret = url.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && querySecret !== cronSecret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Ensure the property exists on the database
  const propertyAdded = await ensureCarouselProperty();

  // Single page mode
  const singlePageId = url.searchParams.get('page');
  if (singlePageId) {
    const success = await updatePageCarouselUrl(singlePageId);
    return NextResponse.json({
      status: success ? 'updated' : 'error',
      pageId: singlePageId,
      url: success ? `${SITE_URL}/carousel/${singlePageId.replace(/-/g, '')}` : null,
      propertyAdded,
    });
  }

  // Batch mode: find all Creative Ready pages missing carousel URL
  const pages = await findCreativeReadyPages();

  if (pages.length === 0) {
    return NextResponse.json({
      status: 'skip',
      reason: 'All Creative Ready entries already have carousel URLs',
      propertyAdded,
    });
  }

  const results: Array<{ id: string; title: string; success: boolean; url: string }> = [];
  for (const page of pages) {
    const success = await updatePageCarouselUrl(page.id);
    results.push({
      id: page.id,
      title: page.title,
      success,
      url: `${SITE_URL}/carousel/${page.id.replace(/-/g, '')}`,
    });
  }

  return NextResponse.json({
    status: 'done',
    updated: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
    propertyAdded,
  });
}
