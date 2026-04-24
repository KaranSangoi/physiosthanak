import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `You are redesigning an Instagram carousel slide for a physiotherapy clinic called PhysioSthanak.

RULES:
- Keep ALL text content EXACTLY as-is — do not change, rephrase, or omit any text
- Keep the brand colors: navy blue (#091f33, #14507c), pink/coral (#e8899c), white text
- Add relevant custom medical/physiotherapy illustrations (muscles, bones, spine, brain, exercises)
- Make it visually premium and professional — suitable for Instagram
- Output must be exactly 1080x1080 pixels
- Keep the PhysioSthanak logo/watermark area at the bottom
- Use clean, modern design with good visual hierarchy`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { image, prompt, mode } = body as {
      image: string; // base64 data URL of the slide PNG
      prompt?: string; // optional custom prompt for regeneration
      mode: 'enhance' | 'regenerate';
    };

    if (!image) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    // Extract base64 data from data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Build the prompt
    const userPrompt = mode === 'regenerate' && prompt
      ? `${SYSTEM_PROMPT}\n\nAdditional instruction from the user: ${prompt}`
      : SYSTEM_PROMPT;

    // Call OpenAI Images Edit API
    // Using fetch directly for more control over the multipart form data
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Use the Images API edit endpoint with gpt-image-2
    const formData = new FormData();
    formData.append('model', 'gpt-image-2');
    formData.append('image', new Blob([imageBuffer], { type: 'image/png' }), 'slide.png');
    formData.append('prompt', userPrompt);
    formData.append('size', '1024x1024');
    formData.append('quality', 'medium');
    formData.append('n', '1');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
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

    // Return the enhanced image (base64 or URL depending on response format)
    const enhancedImage = resultImage.b64_json
      ? `data:image/png;base64,${resultImage.b64_json}`
      : resultImage.url;

    return NextResponse.json({ image: enhancedImage });
  } catch (error) {
    const err = error as Error;
    console.error('Carousel enhance error:', err.message);
    return NextResponse.json(
      { error: `Enhancement failed: ${err.message}` },
      { status: 500 }
    );
  }
}
