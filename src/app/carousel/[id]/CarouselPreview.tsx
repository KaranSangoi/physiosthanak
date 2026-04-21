'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Slide {
  id: number;
  type: string;
  content: Record<string, string | string[]>;
}

interface CarouselPreviewProps {
  slides: Slide[];
  contentTitle: string;
  publishDate?: string;
  status?: string;
  pageId: string;
}

export default function CarouselPreview({
  slides,
  contentTitle,
  publishDate,
  status,
  pageId,
}: CarouselPreviewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load html2canvas and jszip from CDN
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load html2canvas
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script1.async = true;
    document.head.appendChild(script1);

    // Load jszip
    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script2.async = true;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  const renderSlide = (slide: Slide): React.ReactNode => {
    const idx = slide.id;
    const c = slide.content;
    // Helper: safely get a string value from content (which may be string | string[])
    const str = (key: string): string => {
      const v = c[key];
      if (!v) return '';
      return Array.isArray(v) ? v.join('\n') : v;
    };

    // Slide 1: Cover
    if (idx === 1) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-[#071a2c] via-[#14507c] to-[#091f33] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#e8899c] z-30"></div>
          <div className="absolute top-[-120px] right-[-120px] w-[450px] h-[450px] rounded-full border-4 border-[rgba(232,137,156,0.08)]"></div>
          <div className="absolute bottom-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full bg-[rgba(232,137,156,0.03)]"></div>
          <div className="absolute top-1/2 left-[-200px] w-[400px] h-[400px] rounded-full border-2 border-[rgba(20,80,124,0.15)]"></div>

          <div className="relative z-20 flex flex-col items-center justify-center text-center px-12">
            <div className="text-[#e8899c] font-poppins text-2xl font-bold tracking-widest uppercase mb-8">
              PhysioSthanak
            </div>

            {c.mainWord ? (
              <>
                <div className="text-white font-poppins text-[180px] font-black leading-none drop-shadow-xl">
                  {c.number || ''}
                </div>
                <div className="text-[#e8899c] font-poppins text-[100px] font-black text-center drop-shadow-lg">
                  {c.mainWord}
                </div>
              </>
            ) : (
              <div className="text-white font-poppins text-[52px] font-black leading-tight drop-shadow-xl mb-4">
                {str('title')}
              </div>
            )}

            <div className="text-[#94a3b8] font-inter text-[36px] font-normal text-center mt-4 mb-6">
              {c.subtitleLine || ''}
            </div>

            {c.badge && (
              <div className="bg-[rgba(232,137,156,0.2)] border-2 border-[rgba(232,137,156,0.5)] rounded-full px-10 py-4 text-center mb-6">
                <div className="text-[#e8899c] font-poppins text-[32px] font-black tracking-wider">
                  {c.badge}
                </div>
              </div>
            )}

            {c.hook && (
              <div className="mt-4 bg-[rgba(239,68,68,0.15)] border-2 border-[rgba(239,68,68,0.4)] rounded-full px-10 py-4 text-center">
                <div className="text-[#fca5a5] font-inter text-[28px] font-semibold">
                  {c.hook}
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-10 left-12 text-[#94a3b8] font-inter text-2xl z-20">
            {c.savePrompt || (str('footer').includes('Save') ? str('footer').split('|').find(p => (p as string).includes('Save'))?.trim() : '') || ''}
          </div>
          <div className="absolute bottom-10 right-12 text-[#e8899c] font-poppins text-2xl font-bold tracking-widest z-20">
            {c.swipePrompt || (str('footer').includes('SWIPE') ? str('footer').split('|').find(p => (p as string).includes('SWIPE'))?.trim() : '') || 'SWIPE →'}
          </div>

          <div className="absolute bottom-0 left-0 w-1/5 h-1 bg-[#e8899c]"></div>
        </div>
      );
    }

    // Slide 2: Intro/Why It Matters
    if (idx === 2) {
      return (
        <div className="w-full h-full flex flex-col justify-center px-20 py-[70px] bg-gradient-to-br from-[#091f33] via-[#0d3050] to-[#071a2c] relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[rgba(20,80,124,0.2)]"></div>

          <div className="relative z-20">
            <div className="text-[#e8899c] font-poppins text-xl font-bold tracking-wider uppercase mb-6">
              {c.tag || '📊 THE REALITY'}
            </div>
            <div className="text-white font-poppins text-[56px] font-black leading-tight mb-9">
              {str('title')
                .split(/<span>|<\/span>/)
                .map((part, i) => (
                  <span key={i} className={i % 2 === 1 ? 'text-[#e8899c]' : ''}>
                    {part}
                  </span>
                ))}
            </div>

            <div className="flex gap-[30px] mb-10">
              {Array.isArray(c.stats)
                ? c.stats.map((stat, i) => {
                    const parts = (typeof stat === 'string' ? stat : '').split('|');
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-[rgba(20,80,124,0.4)] border border-[rgba(232,137,156,0.15)] rounded-[20px] p-7 text-center"
                      >
                        <div className="text-[#e8899c] font-poppins text-[52px] font-black">
                          {parts[0]?.trim()}
                        </div>
                        <div className="text-[#94a3b8] font-inter text-[22px] mt-1.5 leading-tight">
                          {parts[1]?.trim()}
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>

            <div className="text-white text-[32px] leading-[1.6]">
              {Array.isArray(c.items) ? (
                <div className="flex flex-col gap-3">
                  {c.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[#e8899c] mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : Array.isArray(c.body) ? (
                c.body.map((line, i) => <div key={i}>{line}</div>)
              ) : (
                c.body || ''
              )}
            </div>
          </div>

          <div className="absolute bottom-9 right-12 text-white font-poppins text-lg opacity-8 uppercase font-semibold tracking-widest">
            PhysioSthanak
          </div>
        </div>
      );
    }

    // Slides 3-7: Mistake slides
    if (idx >= 3 && idx <= 7) {
      const isUrgent = idx === 5;
      const progressWidth = `${idx * 20}%`;

      return (
        <div
          className={`w-full h-full flex flex-col px-[60px] py-[50px] relative overflow-hidden ${
            isUrgent
              ? 'bg-gradient-to-br from-[#1a0a0a] via-[#091f33] to-[#0f0808]'
              : 'bg-gradient-to-br from-[#0a2540] via-[#091f33] to-[#071a2c]'
          }`}
        >
          <div
            className={`absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full ${
              isUrgent
                ? 'bg-[rgba(239,68,68,0.06)]'
                : 'bg-[rgba(20,80,124,0.12)]'
            }`}
          ></div>

          <div className="relative z-20 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3.5">
              <div className="flex items-center gap-4">
                <div
                  className={`w-[66px] h-[66px] rounded-full border-2 flex items-center justify-center text-3xl ${
                    isUrgent
                      ? 'bg-[rgba(239,68,68,0.2)] border-[#ef4444]'
                      : 'bg-[rgba(232,137,156,0.15)] border-[#e8899c]'
                  }`}
                >
                  {c.icon || ''}
                </div>
                <div
                  className={`font-poppins text-xl font-bold tracking-wider uppercase ${
                    isUrgent ? 'text-[#ef4444]' : 'text-[#e8899c]'
                  }`}
                >
                  {c.label || 'MISTAKE'}
                </div>
              </div>
              <div className="text-white font-poppins text-[22px] font-semibold opacity-30 tracking-wider">
                {c.counter || `${idx - 2} of 5`}
              </div>
            </div>

            <div
              className={`text-[120px] font-poppins font-black opacity-15 leading-none mb-4 ${
                isUrgent ? 'text-white' : 'text-[#e8899c]'
              }`}
            >
              {String(idx - 2).padStart(2, '0')}
            </div>

            <div
              className={`text-white font-poppins text-[58px] font-black leading-tight border-l-[6px] pl-7 mb-4 ${
                isUrgent ? 'border-l-[#ef4444]' : 'border-l-[#e8899c]'
              }`}
            >
              {c.title || ''}
            </div>

            <div className="text-[rgba(255,255,255,0.7)] font-inter text-[30px] leading-[1.5] pl-[34px] mb-3.5">
              {c.description || ''}
            </div>

            <div className="mt-auto mb-4">
              <div
                className={`rounded-[24px] px-8 py-7 border-l-[6px] ${
                  isUrgent
                    ? 'bg-[rgba(20,80,124,0.45)] border-l-[#ef4444]'
                    : 'bg-[rgba(20,80,124,0.45)] border-l-[#e8899c]'
                }`}
              >
                <div
                  className={`font-poppins text-xl font-bold tracking-widest uppercase mb-3 ${
                    isUrgent ? 'text-[#ef4444]' : 'text-[#e8899c]'
                  }`}
                >
                  {c.tipLabel || '✅ Do This Instead'}
                </div>
                <div className="text-white font-inter text-[36px] leading-[1.5] font-medium">
                  {c.tipText || ''}
                </div>
              </div>
            </div>

            {c.stat && (
              <div className="flex items-center gap-3.5 pt-4.5">
                <span
                  className={`font-poppins text-[32px] font-black ${
                    isUrgent ? 'text-[#ef4444]' : 'text-[#e8899c]'
                  }`}
                >
                  {str('stat').split('|')[0]?.trim()}
                </span>
                <span className="text-[#64748b] font-inter text-[26px]">
                  {str('stat').split('|')[1]?.trim()}
                </span>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 h-1 bg-[#e8899c]" style={{ width: progressWidth }}></div>
          <div className="absolute bottom-9 right-12 text-white font-poppins text-lg opacity-8 uppercase font-semibold tracking-widest">
            PhysioSthanak
          </div>
        </div>
      );
    }

    // Slide 8: Red Flags
    if (idx === 8) {
      return (
        <div className="w-full h-full flex flex-col justify-center px-20 py-[70px] bg-gradient-to-br from-[#091f33] via-[#1a1020] to-[#0f0a0a] relative overflow-hidden">
          <div className="absolute top-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full bg-[rgba(239,68,68,0.04)]"></div>

          <div className="relative z-20">
            <div className="text-[#ef4444] font-poppins text-xl font-bold tracking-wider uppercase mb-5">
              {c.tag || '🚨 WARNING SIGNS'}
            </div>
            <div className="text-white font-poppins text-[54px] font-black leading-tight mb-10">
              {str('title')
                .split(/<span>|<\/span>/)
                .map((part, i) => (
                  <span key={i} className={i % 2 === 1 ? 'text-[#ef4444]' : ''}>
                    {part}
                  </span>
                ))}
            </div>

            <div className="flex flex-col gap-[22px]">
              {(() => {
                // Combine items and body lines for red flags
                const allItems: string[] = [];
                if (Array.isArray(c.items)) allItems.push(...c.items.map(i => typeof i === 'string' ? i : ''));
                if (Array.isArray(c.body)) allItems.push(...c.body.map(i => typeof i === 'string' ? i : ''));
                else if (typeof c.body === 'string' && c.body) {
                  c.body.split('\n').forEach(line => { if (line.trim()) allItems.push(line.trim()); });
                }
                return allItems.map((item, i) => {
                  // Try to split on | for icon|text format, otherwise use the whole line
                  const pipeIdx = item.indexOf('|');
                  let icon = '🚨';
                  let text = item;
                  if (pipeIdx > 0 && pipeIdx < 5) {
                    icon = item.substring(0, pipeIdx).trim();
                    text = item.substring(pipeIdx + 1).trim();
                  }
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] rounded-[16px] px-7 py-[22px]"
                    >
                      <div className="text-[36px] flex-shrink-0">{icon}</div>
                      <div className="text-[rgba(255,255,255,0.9)] font-inter text-[30px] leading-[1.4] font-medium">
                        {text}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="mt-9 text-[#fca5a5] font-inter text-[28px] font-semibold text-center">
              {c.bottom || ''}
            </div>
          </div>

          <div className="absolute bottom-9 right-12 text-white font-poppins text-lg opacity-8 uppercase font-semibold tracking-widest">
            PhysioSthanak
          </div>
        </div>
      );
    }

    // Slide 9: Self-Check
    if (idx === 9) {
      return (
        <div className="w-full h-full flex flex-col justify-center px-20 py-[70px] bg-gradient-to-br from-[#091f33] via-[#0d3050] to-[#091f33] relative overflow-hidden">
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[rgba(20,80,124,0.15)]"></div>

          <div className="relative z-20">
            <div className="text-[#e8899c] font-poppins text-xl font-bold tracking-wider uppercase mb-5">
              {c.tag || '💾 SAVE THIS'}
            </div>
            <div className="text-white font-poppins text-[52px] font-black leading-tight mb-9">
              {str('title')
                .split(/<span>|<\/span>/)
                .map((part, i) => (
                  <span key={i} className={i % 2 === 1 ? 'text-[#e8899c]' : ''}>
                    {part}
                  </span>
                ))}
            </div>

            <div className="flex flex-col gap-[18px] mb-[34px]">
              {Array.isArray(c.items)
                ? c.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-[18px] bg-[rgba(20,80,124,0.35)] border border-[rgba(232,137,156,0.12)] rounded-[16px] px-7 py-[22px]"
                    >
                      <div className="w-[42px] h-[42px] rounded-[10px] border-[3px] border-[#e8899c] flex items-center justify-center text-[22px] font-bold text-[#e8899c] flex-shrink-0">
                        ☐
                      </div>
                      <div className="text-[rgba(255,255,255,0.9)] font-inter text-[30px] leading-[1.35] font-medium">
                        {item}
                      </div>
                    </div>
                  ))
                : null}
            </div>

            <div className="bg-[rgba(232,137,156,0.1)] border-2 border-[rgba(232,137,156,0.2)] rounded-[20px] px-[30px] py-[26px] text-center">
              <div className="text-white font-inter text-[28px] leading-[1.5] font-medium">
                {str('resultText')
                  .split(/<span>|<\/span>/)
                  .map((part, i) => (
                    <span key={i} className={i % 2 === 1 ? 'text-[#e8899c] font-bold' : ''}>
                      {part}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-9 right-12 text-white font-poppins text-lg opacity-8 uppercase font-semibold tracking-widest">
            PhysioSthanak
          </div>
        </div>
      );
    }

    // Slide 10: CTA
    if (idx === 10) {
      return (
        <div className="w-full h-full flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#14507c] via-[#0b3254] to-[#091f33] relative overflow-hidden">
          <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] rounded-full bg-[rgba(232,137,156,0.04)]"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full border-2 border-[rgba(232,137,156,0.06)]"></div>

          <div className="relative z-20">
            <div className="text-[#94a3b8] font-inter text-[34px] mb-3">
              {c.wantHelp || 'Want help with your back pain?'}
            </div>
            <div className="text-white font-poppins text-[56px] font-black leading-tight mb-7">
              Comment{' '}
              {c.ctaSpan ? (
                <>
                  <span className="text-[#e8899c]">{c.ctaSpan}</span>
                  <br />
                  & We&apos;ll DM You
                </>
              ) : (
                <>
                  <span className="text-[#e8899c]">"HELP"</span>
                  <br />& We&apos;ll DM You
                </>
              )}
            </div>

            <div className="bg-[rgba(232,137,156,0.1)] border-[3px] border-[rgba(232,137,156,0.4)] rounded-[28px] px-[50px] py-9 mb-7">
              <div className="text-white font-inter text-[32px] font-medium mb-4">
                {c.commentInstruction || '👇 Type in the comments:'}
              </div>
              <div className="text-[#e8899c] font-poppins text-[90px] font-black tracking-wider uppercase">
                {c.keyword || 'HELP'}
              </div>
              <div className="text-[#94a3b8] font-inter text-[26px] mt-3 leading-[1.4]">
                {c.commentSub || "We'll reach out personally to understand your problem & help"}
              </div>
            </div>

            <div className="w-20 h-1 bg-[rgba(232,137,156,0.3)] rounded mx-auto mb-6"></div>

            <div className="text-white font-inter text-[34px] font-semibold">
              {c.doctor || 'Dr. Shiva Jain Sangoi'}
            </div>
            <div className="text-[#e8899c] font-poppins text-xl font-semibold tracking-wider my-1.5">
              {c.creds || 'MPTh (Ortho) · FIFA Certified'}
            </div>
            <div className="text-[#64748b] font-inter text-[22px]">
              {c.experience || '9+ Years · 8000+ Patients · Borivali West'}
            </div>
            <div className="text-[#e8899c] font-poppins text-[26px] font-semibold mt-5">
              {c.handle || '@physiosthanak'}
            </div>
            <div className="text-[#94a3b8] font-inter text-[22px] mt-[18px]">
              {c.sharePrompt || '📤 Share with someone who needs this'}
            </div>
          </div>

          <div className="absolute bottom-[30px] text-white text-lg opacity-12 tracking-widest uppercase font-semibold">
            Move · Heal · Improve
          </div>
        </div>
      );
    }

    return <div className="w-full h-full bg-[#0a0a0a]">Slide {idx}</div>;
  };

  const downloadSlide = async (index: number) => {
    const html2canvas = (window as any).html2canvas;
    if (!html2canvas) {
      setStatusMessage('html2canvas not loaded yet');
      return;
    }

    setDownloading(true);
    setStatusMessage(`Rendering slide ${index + 1}...`);

    try {
      const slideEl = slideRefs.current[index];
      if (!slideEl) {
        setStatusMessage('Slide element not found');
        return;
      }

      const canvas = await html2canvas(slideEl, {
        width: 1080,
        height: 1080,
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        allowTaint: true,
      });

      canvas.toBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `slide-${String(index + 1).padStart(2, '0')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setStatusMessage(`Downloaded slide ${index + 1}`);
        setDownloading(false);
      });
    } catch (error) {
      setStatusMessage(`Error: ${(error as Error).message}`);
      setDownloading(false);
    }
  };

  const downloadAllSlides = async () => {
    const html2canvas = (window as any).html2canvas;
    const JSZip = (window as any).JSZip;

    if (!html2canvas || !JSZip) {
      setStatusMessage('Libraries not loaded yet');
      return;
    }

    setDownloading(true);
    setStatusMessage('Starting download of all 10 slides...');

    try {
      const zip = new JSZip();
      const folder = zip.folder('carousel-slides');

      for (let i = 0; i < slides.length; i++) {
        setStatusMessage(`Rendering slide ${i + 1} of ${slides.length}...`);

        const slideEl = slideRefs.current[i];
        if (!slideEl) continue;

        const canvas = await html2canvas(slideEl, {
          width: 1080,
          height: 1080,
          scale: 2,
          useCORS: true,
          backgroundColor: null,
          allowTaint: true,
        });

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b: Blob | null) => resolve(b as Blob));
        });

        folder?.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob);

        await new Promise((r) => setTimeout(r, 300));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'carousel-slides.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage('All 10 slides downloaded as ZIP');
      setDownloading(false);
    } catch (error) {
      setStatusMessage(`Error: ${(error as Error).message}`);
      setDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[#e8899c] font-poppins text-sm font-bold tracking-widest uppercase mb-2">
            PhysioSthanak
          </h1>
          <h2 className="font-poppins text-4xl font-black mb-3">{contentTitle}</h2>
          {publishDate && <p className="text-[#64748b] text-sm">Publish Date: {publishDate}</p>}
          {status && <p className="text-[#94a3b8] text-sm">Status: {status}</p>}
        </div>

        {/* Slides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {slides.map((slide, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4">
              <div
                ref={(el) => {
                  slideRefs.current[idx] = el;
                }}
                className="w-full bg-[#111] border border-[#333] rounded-lg overflow-hidden"
                style={{
                  aspectRatio: '1',
                }}
              >
                <div className="w-full h-full" style={{ fontSize: '16px' }}>
                  {renderSlide(slide)}
                </div>
              </div>
              <button
                onClick={() => downloadSlide(idx)}
                disabled={downloading}
                className="w-full bg-[#14507c] hover:bg-[#e8899c] text-white font-inter font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
              >
                📥 Download PNG
              </button>
            </div>
          ))}
        </div>

        {/* Download All Button */}
        <div className="text-center mb-8">
          <button
            onClick={downloadAllSlides}
            disabled={downloading}
            className="bg-[#e8899c] hover:bg-[#d4768a] text-[#0a0a0a] font-inter font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait text-lg"
          >
            📥 Download All 10 Slides as ZIP
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="text-center text-[#94a3b8] font-inter text-sm">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}