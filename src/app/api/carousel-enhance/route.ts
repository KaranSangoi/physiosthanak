import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `Design an Instagram carousel slide for a physiotherapy clinic called PhysioSthanak.

DESIGN RULES:
- Brand colors: navy blue (#091f33, #14507c), pink/coral (#e8899c), white text
- Add relevant custom medical/physiotherapy illustrations (muscles, bones, spine, brain, exercises, stretches)
- Make it visually premium, modern, and professional — suitable for Instagram
- Square format (1:1 ratio)
- Clean layout with good visual hierarchy and breathing room
- Use bold typography for headings, lighter for body text
- Include subtle decorative elements (gradients, circles, lines)
- Keep a small "PhysioSthanak" watermark text at the bottom`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { slideContent, customPrompt } = body as {
      slideContent: string; // text content of the slide
      customPrompt?: string; // optional custom instruction for regeneration
    };

    if (!slideContent) {
      return NextResponse.json({ error: 'Missing slide content' }, { status: 400 });
    }

    // Build the full prompt
    let fullPrompt = `${SYSTEM_PROMPT}\n\nSLIDE CONTENT TO RENDER:\n${slideContent}`;

    if (customPrompt) {
      fullPrompt += `\n\nADDITIONAL INSTRUCTIONS FROM USER:\n${customPrompt}`;
    }

    // Call OpenAI Image Generation API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: fullPrompt,
        size: '1024x1024',
        quality: 'medium',
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      return NextResponse.json(
        { error: `OpenAI API error: ${(errorData as any)?.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const resultImage = (data as any).data?.[0];

    if (!resultImage) {
      return NextResponse.json({ error: 'No image returned from OpenAI' }, { status: 500 });
    }

    // Return the generated image
    const generatedImage = resultImage.b64_json
      ? `data:image/png;base64,${resultImage.b64_json}`
      : resultImage.url;

    return NextResponse.json({ image: generatedImage });
  } catch (error) {
    const err = error as Error;
    console.error('Carousel generate error:', err.message);
    return NextResponse.json(
      { error: `Generation failed: ${err.message}` },
      { status: 500 }
    );
  }
}
