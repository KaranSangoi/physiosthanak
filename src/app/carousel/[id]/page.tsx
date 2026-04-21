import { Metadata } from 'next';
import CarouselPreview from './CarouselPreview';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Block {
  type: string;
  heading_2?: { rich_text: Array<{ plain_text: string }> };
  heading_3?: { rich_text: Array<{ plain_text: string }> };
  paragraph?: { rich_text: Array<{ plain_text: string; annotations: { bold: boolean } }> };
  bulleted_list_item?: { rich_text: Array<{ plain_text: string }> };
}

interface PageProperty {
  type: string;
  title?: Array<{ plain_text: string }>;
  status?: { status: { name: string } };
  date?: { start: string };
}

interface SlideContent {
  id: number;
  type: string;
  content: Record<string, string | string[]>;
}

async function fetchNotionPage(pageId: string) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error('NOTION_TOKEN not configured');
  }

  const apiUrl = `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`;
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  return response.json();
}

async function fetchNotionPageProperties(pageId: string) {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error('NOTION_TOKEN not configured');
  }

  const apiUrl = `https://api.notion.com/v1/pages/${pageId}`;
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  return response.json();
}

function extractBoldText(richText: any[]): string {
  return richText
    .filter((item) => item.annotations?.bold)
    .map((item) => item.plain_text)
    .join('');
}

function extractPlainText(richText: any[]): string {
  return richText.map((item) => item.plain_text).join('');
}

function parseCreativeContent(blocks: Block[]): SlideContent[] {
  const slides: SlideContent[] = [];
  let inCreativeSection = false;
  let currentSlideId = 0;
  let currentSlideContent: Record<string, string | string[]> = {};

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.type === 'heading_2') {
      const text = extractPlainText(block.heading_2?.rich_text || []);
      if (text.includes('Creative Content')) {
        inCreativeSection = true;
        continue;
      }
    }

    if (!inCreativeSection) continue;

    if (block.type === 'heading_3') {
      if (currentSlideId > 0) {
        slides.push({
          id: currentSlideId,
          type: `slide-${currentSlideId}`,
          content: currentSlideContent,
        });
      }

      const text = extractPlainText(block.heading_3?.rich_text || []);
      const match = text.match(/SLIDE (\d+)/);
      if (match) {
        currentSlideId = parseInt(match[1], 10);
        currentSlideContent = {};
      }
    } else if (block.type === 'paragraph' && currentSlideId > 0) {
      const richText = block.paragraph?.rich_text || [];
      const fullText = extractPlainText(richText);

      const boldLabel = extractBoldText(richText);
      if (boldLabel) {
        const labelKey = boldLabel
          .replace(/[*:]/g, '')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_');
        const value = fullText.replace(boldLabel, '').trim();

        if (labelKey === 'main_text' || labelKey === 'title') {
          if (currentSlideContent.title) {
            currentSlideContent.title = `${currentSlideContent.title}\n${value}`;
          } else {
            currentSlideContent.title = value;
          }
        } else if (labelKey === 'subtitle' || labelKey === 'subtitle_line') {
          currentSlideContent.subtitleLine = value;
        } else if (labelKey === 'body') {
          if (Array.isArray(currentSlideContent.body)) {
            (currentSlideContent.body as string[]).push(value);
          } else if (currentSlideContent.body) {
            currentSlideContent.body = [currentSlideContent.body, value];
          } else {
            currentSlideContent.body = value;
          }
        } else if (labelKey === 'footer') {
          currentSlideContent.footer = value;
        } else if (labelKey === 'tag' || labelKey === 'tags') {
          currentSlideContent.tag = value;
        } else if (labelKey === 'badge') {
          currentSlideContent.badge = value;
        } else if (labelKey === 'main_word') {
          currentSlideContent.mainWord = value;
        } else if (labelKey === 'hook') {
          currentSlideContent.hook = value;
        } else if (labelKey === 'save_prompt' || labelKey === 'save') {
          currentSlideContent.savePrompt = value;
        } else if (labelKey === 'number') {
          currentSlideContent.number = value;
        } else if (labelKey === 'label') {
          currentSlideContent.label = value;
        } else if (labelKey === 'counter') {
          currentSlideContent.counter = value;
        } else if (labelKey === 'description' || labelKey === 'desc') {
          currentSlideContent.description = value;
        } else if (labelKey === 'tip_box' || labelKey === 'tip') {
          currentSlideContent.tipText = value;
        } else if (labelKey === 'tip_label') {
          currentSlideContent.tipLabel = value;
        } else if (labelKey === 'stat') {
          currentSlideContent.stat = value;
        } else if (labelKey === 'icon') {
          currentSlideContent.icon = value;
        } else if (labelKey === 'cta_line' || labelKey === 'cta') {
          currentSlideContent.ctaSpan = value;
        } else if (labelKey === 'keyword') {
          currentSlideContent.keyword = value;
        } else if (labelKey === 'doctor') {
          currentSlideContent.doctor = value;
        } else if (labelKey === 'credentials' || labelKey === 'creds') {
          currentSlideContent.creds = value;
        } else if (labelKey === 'location' || labelKey === 'experience') {
          currentSlideContent.experience = value;
        } else if (labelKey === 'handle') {
          currentSlideContent.handle = value;
        } else if (labelKey === 'swipe' || labelKey === 'swipe_prompt') {
          currentSlideContent.swipePrompt = value;
        } else if (labelKey === 'comment_instruction') {
          currentSlideContent.commentInstruction = value;
        } else if (labelKey === 'comment_sub') {
          currentSlideContent.commentSub = value;
        } else if (labelKey === 'want_help') {
          currentSlideContent.wantHelp = value;
        } else if (labelKey === 'share_prompt') {
          currentSlideContent.sharePrompt = value;
        } else if (labelKey === 'result_text') {
          currentSlideContent.resultText = value;
        } else {
          currentSlideContent[labelKey] = value;
        }
      } else if (fullText.trim()) {
        if (currentSlideContent.body) {
          if (Array.isArray(currentSlideContent.body)) {
            (currentSlideContent.body as string[]).push(fullText);
          } else {
            currentSlideContent.body = [currentSlideContent.body, fullText];
          }
        } else {
          currentSlideContent.body = fullText;
        }
      }
    } else if (block.type === 'bulleted_list_item' && currentSlideId > 0) {
      const fullText = extractPlainText(block.bulleted_list_item?.rich_text || []);
      if (fullText.trim()) {
        if (Array.isArray(currentSlideContent.items)) {
          (currentSlideContent.items as string[]).push(fullText);
        } else if (currentSlideContent.items) {
          currentSlideContent.items = [currentSlideContent.items as string, fullText];
        } else {
          currentSlideContent.items = [fullText];
        }
      }
    }
  }

  if (currentSlideId > 0) {
    slides.push({
      id: currentSlideId,
      type: `slide-${currentSlideId}`,
      content: currentSlideContent,
    });
  }

  return slides;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return {
    title: 'Carousel Preview | PhysioSthanak',
    description: 'Instagram carousel preview and download tool',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CarouselPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pageId = id.replace(/-/g, '');

    const [blocksData, pageData] = await Promise.all([
      fetchNotionPage(pageId),
      fetchNotionPageProperties(pageId),
    ]);

    const blocks = blocksData.results || [];
    const slides = parseCreativeContent(blocks);

    if (slides.length === 0) {
      return (
        <div className="w-full min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-poppins text-3xl font-black mb-4">No Creative Content Found</h1>
            <p className="text-[#94a3b8]">
              The Notion page does not contain a &quot;Creative Content (Ready for Carousel HTML)&quot; section yet.
            </p>
          </div>
        </div>
      );
    }

    const properties = pageData.properties || {};
    let contentTitle = 'Carousel Preview';
    let publishDate: string | undefined;
    let status: string | undefined;

    if (properties['Content Idea']?.title) {
      contentTitle = properties['Content Idea'].title
        .map((t: any) => t.plain_text)
        .join('');
    }

    if (properties['Publish Date']?.date?.start) {
      publishDate = properties['Publish Date'].date.start;
    }

    if (properties['Status']?.select?.name) {
      status = properties['Status'].select.name;
    } else if (properties['Status']?.status?.name) {
      status = properties['Status'].status.name;
    }

    return (
      <CarouselPreview
        slides={slides}
        contentTitle={contentTitle}
        publishDate={publishDate}
        status={status}
        pageId={pageId}
      />
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return (
      <div className="w-full min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="font-poppins text-3xl font-black mb-4 text-[#ef4444]">Error Loading Carousel</h1>
          <p className="text-[#94a3b8] mb-6">{errorMsg}</p>
          <p className="text-[#64748b] text-sm">
            Make sure the Notion page ID is correct and the page contains creative content.
          </p>
        </div>
      </div>
    );
  }
}
