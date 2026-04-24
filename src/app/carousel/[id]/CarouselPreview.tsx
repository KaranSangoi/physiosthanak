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
  caption?: string;
  hashtags?: string;
  linkedinCaption?: string;
  renderMode?: boolean;
}

/* ============================================================
   CSS — copied verbatim from instagram-carousel.html
   Scoped under .cs (carousel-slides) to avoid global conflicts
   ============================================================ */
const SLIDE_CSS = `
/* ========== SHARED ========== */
.cs .deco-circle { position: absolute; border-radius: 50%; z-index: 1; }

/* ========== SLIDE 1: COVER ========== */
.cs .slide-cover {
  width: 1080px; height: 1080px; position: relative;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  background: linear-gradient(135deg, #071a2c 0%, #14507c 40%, #0b3254 70%, #091f33 100%);
  overflow: hidden;
}
.cs .cover-top-accent { position: absolute; top: 0; left: 0; width: 100%; height: 6px; background: #e8899c; z-index: 3; }
.cs .cover-brand { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 8px; text-transform: uppercase; margin-bottom: 30px; z-index: 2; }
.cs .cover-number-big { color: #fff; font-family: 'Poppins', sans-serif; font-size: 180px; font-weight: 900; line-height: 1; z-index: 2; text-shadow: 0 4px 40px rgba(0,0,0,0.5); }
.cs .cover-subtitle-line { color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 44px; font-weight: 400; z-index: 2; margin: 6px 0; }
.cs .cover-main-word { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 100px; font-weight: 900; letter-spacing: -2px; z-index: 2; text-shadow: 0 4px 40px rgba(232,137,156,0.3); }
.cs .cover-title-text { color: #fff; font-family: 'Poppins', sans-serif; font-size: 52px; font-weight: 900; line-height: 1.15; z-index: 2; text-shadow: 0 4px 40px rgba(0,0,0,0.5); text-align: center; margin-bottom: 16px; }
.cs .cover-hook {
  margin-top: 40px; z-index: 2;
  background: rgba(239,68,68,0.15); border: 2px solid rgba(239,68,68,0.4);
  border-radius: 50px; padding: 16px 40px;
  color: #fca5a5; font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 600;
}
.cs .cover-badge {
  margin-top: 20px; z-index: 2;
  background: rgba(232,137,156,0.2); border: 2px solid rgba(232,137,156,0.5);
  border-radius: 50px; padding: 16px 40px;
  color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 900; letter-spacing: 2px;
}
.cs .cover-swipe { position: absolute; bottom: 40px; right: 50px; color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 4px; opacity: 0.8; z-index: 2; }
.cs .cover-save-prompt { position: absolute; bottom: 40px; left: 50px; color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 22px; z-index: 2; }

/* ========== SLIDE 2: INTRO ========== */
.cs .slide-intro {
  width: 1080px; height: 1080px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center;
  padding: 70px 80px;
  background: linear-gradient(160deg, #091f33 0%, #0d3050 50%, #071a2c 100%);
}
.cs .intro-tag { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 6px; text-transform: uppercase; margin-bottom: 24px; z-index: 2; }
.cs .intro-title { color: #fff; font-family: 'Poppins', sans-serif; font-size: 56px; font-weight: 800; line-height: 1.15; z-index: 2; margin-bottom: 36px; }
.cs .intro-title span { color: #e8899c; }
.cs .intro-stats-row { display: flex; gap: 30px; z-index: 2; margin-bottom: 40px; }
.cs .intro-stat-card {
  flex: 1; background: rgba(20,80,124,0.4); border-radius: 20px; padding: 28px 24px;
  border: 1px solid rgba(232,137,156,0.15); text-align: center;
}
.cs .intro-stat-num { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 52px; font-weight: 900; }
.cs .intro-stat-desc { color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 22px; margin-top: 6px; line-height: 1.3; }
.cs .intro-body { color: rgba(255,255,255,0.85); font-family: 'Inter', sans-serif; font-size: 32px; line-height: 1.6; z-index: 2; }
.cs .intro-body strong { color: #fff; font-weight: 700; }
.cs .intro-bullet { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
.cs .intro-bullet-dot { color: #e8899c; font-size: 32px; line-height: 1.6; flex-shrink: 0; }

/* ========== MISTAKE SLIDES ========== */
.cs .slide-mistake {
  width: 1080px; height: 1080px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; padding: 50px 60px;
  background: linear-gradient(170deg, #0a2540 0%, #091f33 50%, #071a2c 100%);
}
.cs .mistake-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; z-index: 2; }
.cs .mistake-badge { display: flex; align-items: center; gap: 16px; }
.cs .mistake-icon {
  width: 66px; height: 66px; border-radius: 50%;
  background: rgba(232,137,156,0.15); border: 2px solid #e8899c;
  display: flex; align-items: center; justify-content: center; font-size: 30px;
}
.cs .mistake-icon.urgent { background: rgba(239,68,68,0.2); border-color: #ef4444; }
.cs .mistake-label { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; }
.cs .mistake-label.urgent { color: #ef4444; }
.cs .mistake-counter { color: #fff; font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 600; opacity: 0.3; letter-spacing: 2px; }
.cs .mistake-number { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 120px; font-weight: 900; opacity: 0.15; line-height: 1; margin-bottom: -16px; z-index: 2; }
.cs .mistake-title {
  color: #fff; font-family: 'Poppins', sans-serif; font-size: 58px; font-weight: 800;
  line-height: 1.1; border-left: 6px solid #e8899c; padding-left: 28px;
  margin: 16px 0; z-index: 2;
}
.cs .mistake-title.urgent { border-left-color: #ef4444; }
.cs .mistake-desc {
  color: rgba(255,255,255,0.7); font-family: 'Inter', sans-serif; font-size: 30px;
  line-height: 1.5; z-index: 2; margin-bottom: 14px; padding-left: 34px;
}
.cs .mistake-tipbox {
  margin-top: auto; background: rgba(20,80,124,0.45); border-radius: 24px;
  border-left: 6px solid #e8899c; padding: 28px 32px; z-index: 2;
}
.cs .mistake-tipbox.urgent { border-left-color: #ef4444; }
.cs .mistake-tipbox-label { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px; }
.cs .mistake-tipbox-label.urgent { color: #ef4444; }
.cs .mistake-tipbox-text { color: rgba(255,255,255,0.95); font-family: 'Inter', sans-serif; font-size: 36px; line-height: 1.5; font-weight: 500; }
.cs .mistake-stat { display: flex; align-items: center; gap: 14px; padding: 18px 0 0; z-index: 2; }
.cs .mistake-stat-value { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 800; }
.cs .mistake-stat-value.urgent { color: #ef4444; }
.cs .mistake-stat-label { color: #64748b; font-family: 'Inter', sans-serif; font-size: 26px; }
.cs .slide-watermark { position: absolute; bottom: 30px; right: 40px; z-index: 2; opacity: 0.35; }
.cs .slide-watermark img { height: 50px; width: auto; }
.cs .slide-progress { position: absolute; bottom: 0; left: 0; height: 5px; background: #e8899c; z-index: 2; }

/* ========== SLIDE 8: RED FLAGS ========== */
.cs .slide-redflag {
  width: 1080px; height: 1080px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center; padding: 70px 80px;
  background: linear-gradient(170deg, #091f33 0%, #1a1020 50%, #0f0a0a 100%);
}
.cs .redflag-tag { color: #ef4444; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 6px; text-transform: uppercase; z-index: 2; margin-bottom: 20px; }
.cs .redflag-title { color: #fff; font-family: 'Poppins', sans-serif; font-size: 54px; font-weight: 800; line-height: 1.15; z-index: 2; margin-bottom: 40px; }
.cs .redflag-title span { color: #ef4444; }
.cs .redflag-items { z-index: 2; display: flex; flex-direction: column; gap: 22px; }
.cs .redflag-item {
  display: flex; align-items: center; gap: 20px;
  background: rgba(239,68,68,0.08); border-radius: 16px; padding: 22px 28px;
  border: 1px solid rgba(239,68,68,0.15);
}
.cs .redflag-item-icon { font-size: 36px; flex-shrink: 0; }
.cs .redflag-item-text { color: rgba(255,255,255,0.9); font-family: 'Inter', sans-serif; font-size: 30px; line-height: 1.4; font-weight: 500; }
.cs .redflag-bottom { z-index: 2; margin-top: 36px; color: #fca5a5; font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 600; text-align: center; }

/* ========== SLIDE 9: SELF-CHECK ========== */
.cs .slide-selfcheck {
  width: 1080px; height: 1080px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center; padding: 70px 80px;
  background: linear-gradient(160deg, #091f33 0%, #0d3050 50%, #091f33 100%);
}
.cs .selfcheck-tag { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 6px; text-transform: uppercase; z-index: 2; margin-bottom: 20px; }
.cs .selfcheck-title { color: #fff; font-family: 'Poppins', sans-serif; font-size: 52px; font-weight: 800; line-height: 1.15; z-index: 2; margin-bottom: 36px; }
.cs .selfcheck-title span { color: #e8899c; }
.cs .selfcheck-items { z-index: 2; display: flex; flex-direction: column; gap: 18px; }
.cs .selfcheck-item {
  display: flex; align-items: center; gap: 18px;
  background: rgba(20,80,124,0.35); border-radius: 16px; padding: 22px 28px;
  border: 1px solid rgba(232,137,156,0.12);
}
.cs .selfcheck-checkbox {
  flex-shrink: 0; color: #e8899c; font-size: 28px; font-weight: 700; line-height: 1;
}
.cs .selfcheck-item-text { color: rgba(255,255,255,0.9); font-family: 'Inter', sans-serif; font-size: 30px; line-height: 1.35; font-weight: 500; }
.cs .selfcheck-result {
  z-index: 2; margin-top: 34px; background: rgba(232,137,156,0.1); border-radius: 20px; padding: 26px 30px;
  border: 2px solid rgba(232,137,156,0.2); text-align: center;
}
.cs .selfcheck-result-text { color: #fff; font-family: 'Inter', sans-serif; font-size: 28px; line-height: 1.5; font-weight: 500; }
.cs .selfcheck-result-text span { color: #e8899c; font-weight: 700; }

/* ========== SLIDE 10: CTA ========== */
.cs .slide-cta {
  width: 1080px; height: 1080px; position: relative; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #14507c 0%, #0b3254 50%, #091f33 100%);
}
.cs .cta-want-help { z-index: 2; color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 34px; margin-bottom: 12px; }
.cs .cta-title { color: #fff; font-family: 'Poppins', sans-serif; font-size: 56px; font-weight: 900; line-height: 1.15; margin-bottom: 28px; z-index: 2; }
.cs .cta-title span { color: #e8899c; }
.cs .cta-comment-box {
  z-index: 2; background: rgba(232,137,156,0.1); border: 3px solid rgba(232,137,156,0.4);
  border-radius: 28px; padding: 36px 50px; margin-bottom: 28px; text-align: center;
}
.cs .cta-comment-instruction { color: #fff; font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 500; margin-bottom: 16px; }
.cs .cta-keyword { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 90px; font-weight: 900; letter-spacing: 8px; text-transform: uppercase; }
.cs .cta-comment-sub { color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 26px; margin-top: 12px; line-height: 1.4; }
.cs .cta-divider { width: 80px; height: 4px; background: rgba(232,137,156,0.3); border-radius: 3px; margin: 0 auto 24px; z-index: 2; }
.cs .cta-doctor { color: #fff; font-family: 'Inter', sans-serif; font-size: 34px; font-weight: 600; z-index: 2; }
.cs .cta-creds { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 20px; font-weight: 600; letter-spacing: 2px; margin: 6px 0 6px; z-index: 2; }
.cs .cta-exp { color: #64748b; font-family: 'Inter', sans-serif; font-size: 22px; z-index: 2; }
.cs .cta-handle { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 26px; font-weight: 600; margin-top: 20px; z-index: 2; }
.cs .cta-tagline { position: absolute; bottom: 30px; color: #fff; font-size: 18px; opacity: 0.12; letter-spacing: 6px; text-transform: uppercase; font-weight: 600; z-index: 2; }
.cs .cta-share-prompt { z-index: 2; color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 22px; margin-top: 18px; }

/* ========== SLIDE CONTAINER & CONTROLS ========== */
.cs .slide-container {
  width: 1080px; height: 1080px;
  position: relative; overflow: hidden;
  border-radius: 8px;
  transform: scale(0.45); transform-origin: top center;
  margin-bottom: -594px;
}
.cs .controls { display: flex; align-items: center; gap: 16px; margin-top: 20px; justify-content: center; }
.cs .nav-btn { background: #14507c; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.cs .nav-btn:hover { background: #e8899c; }
.cs .nav-btn:disabled { opacity: 0.3; cursor: default; }
.cs .dots { display: flex; gap: 8px; }
.cs .dot { width: 10px; height: 10px; border-radius: 5px; background: rgba(20,80,124,0.25); cursor: pointer; transition: all 0.3s; }
.cs .dot.active { width: 24px; background: #e8899c; }
.cs .slide-label-text { color: #64748b; font-size: 12px; margin-top: 8px; text-align: center; }
.cs .dl-controls { display: flex; gap: 12px; margin-top: 16px; justify-content: center; }
.cs .dl-btn { background: #14507c; color: #fff; border: none; padding: 12px 28px; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.cs .dl-btn:hover { background: #e8899c; }
.cs .dl-btn:disabled { opacity: 0.5; cursor: wait; }
.cs .dl-btn.primary { background: #e8899c; }
.cs .dl-btn.primary:hover { background: #d4768a; }
.cs .status-text { color: #64748b; font-size: 12px; margin-top: 8px; text-align: center; }
.cs .caption-box { margin-top: 24px; max-width: 500px; width: 100%; background: #111; border-radius: 12px; padding: 24px; border: 1px solid rgba(20,80,124,0.3); }
.cs .caption-label { color: #e8899c; font-family: 'Poppins', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px; }
.cs .caption-text { color: #e2e8f0; font-size: 13px; line-height: 1.8; white-space: pre-wrap; }
.cs .caption-hashtags { color: #14507c; font-size: 11px; margin-top: 14px; line-height: 1.8; }
.cs .copy-btn { margin-top: 12px; background: #14507c; color: #fff; border: none; padding: 8px 20px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.cs .copy-btn:hover { background: #e8899c; }

/* Responsive scale */
@media (max-width: 600px) {
  .cs .slide-container { transform: scale(0.3); margin-bottom: -756px; }
}
@media (min-width: 601px) and (max-width: 900px) {
  .cs .slide-container { transform: scale(0.4); margin-bottom: -648px; }
}
@media (min-width: 901px) and (max-width: 1200px) {
  .cs .slide-container { transform: scale(0.45); margin-bottom: -594px; }
}
@media (min-width: 1201px) {
  .cs .slide-container { transform: scale(0.5); margin-bottom: -540px; }
}
`;

export default function CarouselPreview({
  slides,
  contentTitle,
  publishDate,
  status,
  pageId,
  caption,
  hashtags,
  linkedinCaption,
  renderMode = false,
}: CarouselPreviewProps) {
  // Logo as base64 data URI — avoids deployment path issues with large PNG
  const LOGO_DATA_URI = 'data:image/png;base64,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';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [copyLabel, setCopyLabel] = useState('📋 Copy Caption + Hashtags');
  const [copyLiLabel, setCopyLiLabel] = useState('📋 Copy LinkedIn Caption');
  const [pngDataUrls, setPngDataUrls] = useState<string[]>([]);
  const [pngLoading, setPngLoading] = useState(false);
  const [pngError, setPngError] = useState('');

  const total = slides.length;
  const slideNames = ['Cover', 'Why This Matters', 'Mistake #1', 'Mistake #2', 'Mistake #3', 'Mistake #4', 'Mistake #5', 'Red Flags', 'Self-Check', 'CTA'];

  const nav = (dir: number) => {
    const n = currentSlide + dir;
    if (n >= 0 && n < total) setCurrentSlide(n);
  };

  // Load html2canvas, jszip and jspdf from CDN
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loadScript = (src: string) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
      return script;
    };
    const script1 = loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    const script2 = loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    const script3 = loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    // Fallback: if 2.5.1 fails, try 2.5.2
    script3.onerror = () => {
      document.head.removeChild(script3);
      const fallback = loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js');
      fallback.onerror = () => {
        document.head.removeChild(fallback);
        // Last resort: try unpkg
        loadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js');
      };
    };
    return () => {
      [script1, script2, script3].forEach(s => { try { document.head.removeChild(s); } catch {} });
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nav(1);
      if (e.key === 'ArrowLeft') nav(-1);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  });

  // Fetch server-rendered PNGs on mount (normal mode only)
  useEffect(() => {
    if (renderMode || typeof window === 'undefined') return;
    setPngLoading(true);
    setPngError('');
    fetch(`/api/carousel-png?page=${pageId}`)
      .then(res => {
        if (!res.ok) throw new Error(`PNG generation failed (${res.status})`);
        return res.json();
      })
      .then((data: { images: string[] }) => {
        setPngDataUrls(data.images);
        setPngLoading(false);
      })
      .catch(err => {
        console.error('PNG generation error:', err);
        setPngError(err.message || 'Failed to generate PNGs');
        setPngLoading(false);
      });
  }, [pageId, renderMode]);

  /* ============================================================
     renderSlide — uses exact same HTML structure + CSS classes
     as instagram-carousel.html, just with dynamic Notion content
     ============================================================ */
  const renderSlide = (slide: Slide): React.ReactNode => {
    const idx = slide.id;
    const c = slide.content;
    const str = (key: string): string => {
      const v = c[key];
      if (!v) return '';
      return Array.isArray(v) ? v.join('\n') : v;
    };

    // ---- SLIDE 1: COVER ----
    if (idx === 1) {
      return (
        <div className="slide-cover">
          <div className="deco-circle" style={{top:'-120px',right:'-120px',width:'450px',height:'450px',border:'3px solid rgba(232,137,156,0.08)'}}></div>
          <div className="deco-circle" style={{bottom:'-80px',left:'-80px',width:'350px',height:'350px',background:'rgba(232,137,156,0.03)'}}></div>
          <div className="deco-circle" style={{top:'50%',left:'-200px',width:'400px',height:'400px',border:'2px solid rgba(20,80,124,0.15)'}}></div>
          <div className="cover-top-accent"></div>
          <div className="cover-brand">PhysioSthanak</div>

          {c.number && <div className="cover-number-big">{c.number}</div>}
          {str('title') && <div className="cover-title-text">{str('title')}</div>}
          {c.subtitleLine && <div className="cover-subtitle-line">{c.subtitleLine}</div>}
          {c.mainWord && <div className="cover-main-word">{c.mainWord}</div>}

          {c.badge && <div className="cover-badge">{c.badge}</div>}

          {c.hook && <div className="cover-hook">{c.hook}</div>}

          <div className="cover-save-prompt">
            {c.savePrompt || (str('footer').includes('Save') ? str('footer').split('|').find(p => (p as string).includes('Save'))?.trim() : '') || '💾 Save this for later'}
          </div>
          <div className="cover-swipe">
            {c.swipePrompt || (str('footer').includes('SWIPE') ? str('footer').split('|').find(p => (p as string).includes('SWIPE'))?.trim() : '') || 'SWIPE →'}
          </div>
          <div className="slide-watermark" style={{ right: 'auto', left: '50%', transform: 'translateX(-50%)' }}><img src={LOGO_DATA_URI} alt="PhysioSthanak" /></div>
        </div>
      );
    }

    // ---- SLIDE 2: INTRO / WHY THIS MATTERS ----
    if (idx === 2) {
      return (
        <div className="slide-intro">
          <div className="deco-circle" style={{top:'-100px',right:'-100px',width:'400px',height:'400px',background:'rgba(20,80,124,0.2)'}}></div>
          <div className="intro-tag">{c.tag || '📊 THE REALITY'}</div>
          <div className="intro-title" dangerouslySetInnerHTML={{ __html: str('title').replace(/<span>/g, '<span>') }} />

          {Array.isArray(c.stats) && (
            <div className="intro-stats-row">
              {c.stats.map((stat, i) => {
                const parts = (typeof stat === 'string' ? stat : '').split('|');
                return (
                  <div key={i} className="intro-stat-card">
                    <div className="intro-stat-num">{parts[0]?.trim()}</div>
                    <div className="intro-stat-desc">{parts[1]?.trim()}</div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="intro-body">
            {Array.isArray(c.items) ? (
              c.items.map((item, i) => (
                <div key={i} className="intro-bullet">
                  <span className="intro-bullet-dot">•</span>
                  <span>{item}</span>
                </div>
              ))
            ) : Array.isArray(c.body) ? (
              c.body.map((line, i) => <div key={i}>{line}</div>)
            ) : c.body ? (
              <div>{c.body}</div>
            ) : null}
          </div>

          <div className="slide-watermark"><img src={LOGO_DATA_URI} alt="PhysioSthanak" /></div>
        </div>
      );
    }

    // ---- SLIDES 3-7: MISTAKES ----
    if (idx >= 3 && idx <= 7) {
      const isUrgent = idx === 5;
      const mistakeNum = idx - 2;
      const progressPct = `${mistakeNum * 20}%`;

      return (
        <div className="slide-mistake" style={isUrgent ? {background:'linear-gradient(170deg,#1a0a0a 0%,#091f33 50%,#0f0808 100%)'} : undefined}>
          <div className="deco-circle" style={isUrgent
            ? {top:'-60px',right:'-60px',width:'300px',height:'300px',background:'rgba(239,68,68,0.06)'}
            : {bottom:'-100px',right:'-60px',width:'350px',height:'350px',background:'rgba(20,80,124,0.12)'}
          }></div>

          <div className="mistake-topbar">
            <div className="mistake-badge">
              <div className={`mistake-icon${isUrgent ? ' urgent' : ''}`}>{c.icon || '💡'}</div>
              <div className={`mistake-label${isUrgent ? ' urgent' : ''}`}>{c.label || 'MISTAKE'}</div>
            </div>
            <div className="mistake-counter">{c.counter || `${mistakeNum} of 5`}</div>
          </div>

          <div className="mistake-number">{String(mistakeNum).padStart(2, '0')}</div>
          <div className={`mistake-title${isUrgent ? ' urgent' : ''}`}>{c.title || ''}</div>
          <div className="mistake-desc">{c.description || (typeof c.body === 'string' ? c.body : Array.isArray(c.body) ? c.body.join(' ') : '')}</div>

          <div className={`mistake-tipbox${isUrgent ? ' urgent' : ''}`}>
            <div className={`mistake-tipbox-label${isUrgent ? ' urgent' : ''}`}>{c.tipLabel || '✅ Do This Instead'}</div>
            <div className="mistake-tipbox-text">{c.tipText || ''}</div>
          </div>

          {c.stat && (
            <div className="mistake-stat">
              <span className={`mistake-stat-value${isUrgent ? ' urgent' : ''}`}>{str('stat').split('|')[0]?.trim()}</span>
              <span className="mistake-stat-label">{str('stat').split('|')[1]?.trim()}</span>
            </div>
          )}

          <div className="slide-progress" style={{width: progressPct}}></div>
          <div className="slide-watermark"><img src={LOGO_DATA_URI} alt="PhysioSthanak" /></div>
        </div>
      );
    }

    // ---- SLIDE 8: RED FLAGS ----
    if (idx === 8) {
      const allItems: string[] = [];
      if (Array.isArray(c.items)) allItems.push(...c.items.map(i => typeof i === 'string' ? i : ''));
      if (Array.isArray(c.body)) allItems.push(...c.body.map(i => typeof i === 'string' ? i : ''));
      else if (typeof c.body === 'string' && c.body) {
        c.body.split('\n').forEach(line => { if (line.trim()) allItems.push(line.trim()); });
      }

      return (
        <div className="slide-redflag">
          <div className="deco-circle" style={{top:'-80px',right:'-80px',width:'350px',height:'350px',background:'rgba(239,68,68,0.04)'}}></div>
          <div className="redflag-tag">{c.tag || '🚨 WARNING SIGNS'}</div>
          <div className="redflag-title" dangerouslySetInnerHTML={{ __html: str('title').replace(/<span>/g, '<span>') }} />

          <div className="redflag-items">
            {allItems.map((item, i) => {
              // Strip leading emoji if present to avoid doubling
              const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)\s*/u;
              const emojiMatch = item.match(emojiRegex);
              const icon = emojiMatch ? emojiMatch[0].trim() : '🚨';
              const text = emojiMatch ? item.replace(emojiRegex, '') : item;
              return (
                <div key={i} className="redflag-item">
                  <div className="redflag-item-icon">{icon}</div>
                  <div className="redflag-item-text">{text}</div>
                </div>
              );
            })}
          </div>

          {c.bottom && <div className="redflag-bottom">{c.bottom}</div>}
          <div className="slide-watermark"><img src={LOGO_DATA_URI} alt="PhysioSthanak" /></div>
        </div>
      );
    }

    // ---- SLIDE 9: SELF-CHECK ----
    if (idx === 9) {
      let checkItems: string[] = [];
      if (Array.isArray(c.items) && c.items.length > 0) {
        checkItems = c.items.map(i => typeof i === 'string' ? i : '');
      } else if (Array.isArray(c.body)) {
        checkItems = c.body.map(i => typeof i === 'string' ? i : '');
      } else if (typeof c.body === 'string' && c.body) {
        checkItems = c.body.split('\n').filter(l => l.trim());
      }

      return (
        <div className="slide-selfcheck">
          <div className="deco-circle" style={{bottom:'-100px',right:'-100px',width:'400px',height:'400px',background:'rgba(20,80,124,0.15)'}}></div>
          <div className="selfcheck-tag">{c.tag || '💾 SAVE THIS'}</div>
          <div className="selfcheck-title" dangerouslySetInnerHTML={{ __html: str('title').replace(/<span>/g, '<span>') }} />

          <div className="selfcheck-items">
            {checkItems.map((item, i) => {
              // Strip leading ☐ if present to avoid doubling
              const cleanItem = item.replace(/^☐\s*/, '');
              return (
                <div key={i} className="selfcheck-item">
                  <div className="selfcheck-checkbox">☐</div>
                  <div className="selfcheck-item-text">{cleanItem}</div>
                </div>
              );
            })}
          </div>

          {str('resultText') && (
            <div className="selfcheck-result">
              <div className="selfcheck-result-text" dangerouslySetInnerHTML={{ __html: str('resultText').replace(/<span>/g, '<span>') }} />
            </div>
          )}

          <div className="slide-watermark"><img src={LOGO_DATA_URI} alt="PhysioSthanak" /></div>
        </div>
      );
    }

    // ---- SLIDE 10: CTA ----
    if (idx === 10) {
      return (
        <div className="slide-cta">
          <div className="deco-circle" style={{top:'-150px',left:'-150px',width:'500px',height:'500px',background:'rgba(232,137,156,0.04)'}}></div>
          <div className="deco-circle" style={{bottom:'-100px',right:'-100px',width:'400px',height:'400px',border:'2px solid rgba(232,137,156,0.06)'}}></div>

          <div className="cta-want-help">{c.wantHelp || 'Want help with your back pain?'}</div>
          <div className="cta-title" dangerouslySetInnerHTML={{
            __html: c.title
              ? str('title')
                  .replace(/"([^"]+)"/g, '<span>"$1"</span>')
                  .replace(/\n/g, '<br/>')
              : `Comment <span>"${c.keyword || 'HELP'}"</span><br/>& We'll DM You`
          }} />

          <div className="cta-comment-box">
            <div className="cta-comment-instruction">{c.commentInstruction || '👇 Type in the comments:'}</div>
            <div className="cta-keyword">{c.keyword || 'HELP'}</div>
            <div className="cta-comment-sub">{c.commentSub || "We'll reach out personally to understand your problem & help"}</div>
          </div>

          <div className="cta-divider"></div>
          <div className="cta-doctor">{c.doctor || 'Dr. Shiva Jain Sangoi'}</div>
          <div className="cta-creds">{c.creds || 'MPTh (Ortho) · FIFA Certified'}</div>
          <div className="cta-exp">{c.experience || '9+ Years · 8000+ Patients · Borivali West'}</div>
          <div className="cta-handle">{c.handle || '@physiosthanak'}</div>
          <div className="cta-share-prompt">{c.sharePrompt || '📤 Share with someone who needs this'}</div>
          <div className="cta-tagline">Move · Heal · Improve</div>
          <div className="slide-watermark"><img src={LOGO_DATA_URI} alt="PhysioSthanak" /></div>
        </div>
      );
    }

    return <div style={{width:'1080px',height:'1080px',background:'#0a0a0a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Poppins'}}>Slide {idx}</div>;
  };

  /* ============================================================
     Download functions
     ============================================================ */
  // Helper: capture a slide at full 1080x1080 using the original element
  const captureSlide = async (index: number): Promise<HTMLCanvasElement | null> => {
    const html2canvas = (window as any).html2canvas;
    if (!html2canvas) return null;

    const slideEl = slideRefs.current[index];
    if (!slideEl) return null;

    // Save original styles
    const origDisplay = slideEl.style.display;
    const origTransform = slideEl.style.transform;
    const origMarginBottom = slideEl.style.marginBottom;
    const origBorderRadius = slideEl.style.borderRadius;

    // Show at full size for capture
    slideEl.style.display = 'block';
    slideEl.style.transform = 'none';
    slideEl.style.marginBottom = '0';
    slideEl.style.borderRadius = '0';

    // Force reflow and wait for browser to fully render layout + fonts
    void slideEl.offsetHeight;
    await new Promise(r => setTimeout(r, 800));

    const innerSlide = slideEl.firstElementChild as HTMLElement;
    const canvas = await html2canvas(innerSlide || slideEl, {
      width: 1080, height: 1080, scale: 1,
      useCORS: true, backgroundColor: null, allowTaint: true,
    });

    // Restore original styles
    slideEl.style.display = index === currentSlide ? 'block' : origDisplay;
    slideEl.style.transform = origTransform;
    slideEl.style.marginBottom = origMarginBottom;
    slideEl.style.borderRadius = origBorderRadius;

    return canvas;
  };

  const downloadSlide = async (index: number) => {
    const html2canvas = (window as any).html2canvas;
    if (!html2canvas) { setStatusMessage('html2canvas not loaded yet'); return; }

    setDownloading(true);
    setStatusMessage(`Rendering slide ${index + 1}...`);

    try {
      const canvas = await captureSlide(index);
      if (!canvas) { setStatusMessage('Slide element not found'); setDownloading(false); return; }

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) { setStatusMessage('Failed to render slide'); setDownloading(false); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `slide-${String(index + 1).padStart(2, '0')}.png`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
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
    if (!html2canvas || !JSZip) { setStatusMessage('Libraries not loaded yet'); return; }

    setDownloading(true);
    setStatusMessage('Starting download of all slides...');

    try {
      const zip = new JSZip();
      const folder = zip.folder('carousel-slides');

      for (let i = 0; i < slides.length; i++) {
        setStatusMessage(`Rendering slide ${i + 1} of ${slides.length}...`);
        const canvas = await captureSlide(i);
        if (!canvas) continue;

        const blob = await new Promise<Blob>(resolve => {
          canvas.toBlob((b: Blob | null) => resolve(b as Blob));
        });
        folder?.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url; a.download = 'carousel-slides.zip';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage('All slides downloaded as ZIP');
      setDownloading(false);
    } catch (error) {
      setStatusMessage(`Error: ${(error as Error).message}`);
      setDownloading(false);
    }
  };

  const downloadPDF = async () => {
    const html2canvas = (window as any).html2canvas;
    const jspdf = (window as any).jspdf;
    if (!html2canvas || !jspdf) { setStatusMessage('Libraries not loaded yet — wait a moment'); return; }

    setDownloading(true);
    setStatusMessage('Generating PDF for LinkedIn...');

    try {
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1080, 1080],
        hotfixes: ['px_scaling'],
      });

      for (let i = 0; i < slides.length; i++) {
        setStatusMessage(`Rendering slide ${i + 1} of ${slides.length} for PDF...`);
        const canvas = await captureSlide(i);
        if (!canvas) continue;

        const imgData = canvas.toDataURL('image/png');
        if (i > 0) pdf.addPage([1080, 1080]);
        pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1080);
      }

      pdf.save('carousel-linkedin.pdf');
      setStatusMessage('PDF downloaded — upload to LinkedIn as a document post');
      setDownloading(false);
    } catch (error) {
      setStatusMessage(`Error: ${(error as Error).message}`);
      setDownloading(false);
    }
  };

  const copyCaption = () => {
    const captionEl = document.getElementById('captionContent');
    const hashtagsEl = document.getElementById('captionHashtags');
    if (captionEl && hashtagsEl) {
      const text = captionEl.textContent + '\n\n' + hashtagsEl.textContent;
      navigator.clipboard.writeText(text).then(() => {
        setCopyLabel('✅ Copied!');
        setTimeout(() => setCopyLabel('📋 Copy Caption + Hashtags'), 2000);
      });
    }
  };

  const copyLinkedinCaption = () => {
    const liCaptionEl = document.getElementById('linkedinCaptionContent');
    if (liCaptionEl) {
      navigator.clipboard.writeText(liCaptionEl.textContent || '').then(() => {
        setCopyLiLabel('✅ Copied!');
        setTimeout(() => setCopyLiLabel('📋 Copy LinkedIn Caption'), 2000);
      });
    }
  };

  /* ============================================================
     RENDER MODE — all slides at native 1080x1080, no controls,
     for Puppeteer to screenshot each one
     ============================================================ */
  if (renderMode) {
    return (
      <div className="cs" style={{ background: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>
        <style dangerouslySetInnerHTML={{ __html: SLIDE_CSS }} />
        {slides.map((slide, idx) => (
          <div
            key={idx}
            id={`render-slide-${idx}`}
            style={{ width: '1080px', height: '1080px', overflow: 'hidden' }}
          >
            {renderSlide(slide)}
          </div>
        ))}
      </div>
    );
  }

  /* ============================================================
     Render — same layout as instagram-carousel.html
     ============================================================ */

  // Helper: download a PNG from data URL
  const downloadPngFromUrl = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // PNG-based download functions (used when server PNGs are available)
  const downloadSlidePng = (index: number) => {
    if (!pngDataUrls[index]) return;
    downloadPngFromUrl(pngDataUrls[index], `slide-${String(index + 1).padStart(2, '0')}.png`);
  };

  const downloadAllSlidesPng = async () => {
    const JSZip = (window as any).JSZip;
    if (!JSZip || pngDataUrls.length === 0) { setStatusMessage('PNGs not ready yet'); return; }
    setDownloading(true);
    setStatusMessage('Creating ZIP...');
    try {
      const zip = new JSZip();
      const folder = zip.folder('carousel-slides');
      for (let i = 0; i < pngDataUrls.length; i++) {
        const base64 = pngDataUrls[i].split(',')[1];
        folder?.file(`slide-${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true });
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url; a.download = 'carousel-slides.zip';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage('All slides downloaded as ZIP');
    } catch (error) {
      setStatusMessage(`Error: ${(error as Error).message}`);
    }
    setDownloading(false);
  };

  const downloadPdfFromPngs = async () => {
    const jspdf = (window as any).jspdf;
    if (!jspdf || pngDataUrls.length === 0) { setStatusMessage('Libraries not ready yet'); return; }
    setDownloading(true);
    setStatusMessage('Generating PDF for LinkedIn...');
    try {
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait', unit: 'px', format: [1080, 1080],
        hotfixes: ['px_scaling'],
      });
      for (let i = 0; i < pngDataUrls.length; i++) {
        if (i > 0) pdf.addPage([1080, 1080]);
        pdf.addImage(pngDataUrls[i], 'PNG', 0, 0, 1080, 1080);
      }
      pdf.save('carousel-linkedin.pdf');
      setStatusMessage('PDF downloaded — upload to LinkedIn as a document post');
    } catch (error) {
      setStatusMessage(`Error: ${(error as Error).message}`);
    }
    setDownloading(false);
  };

  // Determine if we use PNG mode (server-rendered) or fallback (html2canvas)
  const hasPngs = pngDataUrls.length > 0;

  return (
    <div className="cs" style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px' }}>
      <style dangerouslySetInnerHTML={{ __html: SLIDE_CSS }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', color: '#e8899c', marginBottom: '6px', fontWeight: 700 }}>
          PhysioSthanak
        </h1>
        <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
          Instagram Carousel Preview — {total} slides at 1080×1080px
        </p>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '20px', fontWeight: 800, marginTop: '12px', marginBottom: '4px' }}>
          {contentTitle}
        </h2>
        {publishDate && <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0' }}>Publish: {publishDate}</p>}
        {status && <p style={{ color: '#94a3b8', fontSize: '11px', margin: '2px 0' }}>Status: {status}</p>}
      </div>

      {/* Loading indicator for server-rendered PNGs */}
      {pngLoading && (
        <div style={{ color: '#e8899c', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
          ⏳ Generating pixel-perfect slides... (this takes ~20 seconds on first load)
        </div>
      )}
      {pngError && !hasPngs && (
        <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
          PNG generation failed: {pngError}. Using live preview instead.
        </div>
      )}

      {/* Carousel — show PNGs if available, otherwise live HTML slides */}
      <div className="carousel-wrapper">
        {hasPngs ? (
          /* Server-rendered PNG preview */
          slides.map((_, idx) => (
            <div
              key={idx}
              className="slide-container"
              style={{ display: idx === currentSlide ? 'block' : 'none' }}
            >
              <img
                src={pngDataUrls[idx]}
                alt={`Slide ${idx + 1}`}
                style={{ width: '1080px', height: '1080px', display: 'block' }}
              />
            </div>
          ))
        ) : (
          /* Live HTML slide preview (fallback) */
          slides.map((slide, idx) => (
            <div
              key={idx}
              ref={el => { slideRefs.current[idx] = el; }}
              className="slide-container"
              style={{ display: idx === currentSlide ? 'block' : 'none' }}
            >
              {renderSlide(slide)}
            </div>
          ))
        )}
      </div>

      {/* Navigation Controls */}
      <div className="controls">
        <button className="nav-btn" onClick={() => nav(-1)} disabled={currentSlide === 0}>← Prev</button>
        <div className="dots">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`dot${i === currentSlide ? ' active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
        <button className="nav-btn" onClick={() => nav(1)} disabled={currentSlide === total - 1}>Next →</button>
      </div>

      <div className="slide-label-text">
        Slide {currentSlide + 1} of {total} — {slideNames[currentSlide] || `Slide ${currentSlide + 1}`}
      </div>

      {/* Download Buttons */}
      <div className="dl-controls">
        <button className="dl-btn" onClick={() => hasPngs ? downloadSlidePng(currentSlide) : downloadSlide(currentSlide)} disabled={downloading || (pngLoading && !hasPngs)}>
          📥 Download This Slide
        </button>
        <button className="dl-btn primary" onClick={() => hasPngs ? downloadAllSlidesPng() : downloadAllSlides()} disabled={downloading || (pngLoading && !hasPngs)}>
          📥 Download All {total} Slides
        </button>
        <button className="dl-btn" onClick={() => hasPngs ? downloadPdfFromPngs() : downloadPDF()} disabled={downloading || (pngLoading && !hasPngs)} style={{ background: '#0a66c2' }}>
          📄 Download PDF for LinkedIn
        </button>
      </div>
      {hasPngs && (
        <div style={{ color: '#22c55e', fontSize: '11px', marginTop: '4px', textAlign: 'center' }}>
          ✅ Server-rendered PNGs — pixel-perfect downloads ready
        </div>
      )}

      {statusMessage && <div className="status-text">{statusMessage}</div>}

      {/* Caption Box */}
      {caption && (
        <div className="caption-box">
          <div className="caption-label">Instagram Caption</div>
          <div className="caption-text" id="captionContent">{caption}</div>
          {hashtags && (
            <div className="caption-hashtags" id="captionHashtags">{hashtags}</div>
          )}
          <button className="copy-btn" onClick={copyCaption}>{copyLabel}</button>
        </div>
      )}

      {linkedinCaption && (
        <div className="caption-box" style={{ borderColor: 'rgba(10,102,194,0.3)' }}>
          <div className="caption-label" style={{ color: '#0a66c2' }}>LinkedIn Caption</div>
          <div className="caption-text" id="linkedinCaptionContent">{linkedinCaption}</div>
          <button className="copy-btn" onClick={copyLinkedinCaption} style={{ background: '#0a66c2' }}>{copyLiLabel}</button>
        </div>
      )}

      <p style={{ color: '#64748b', fontSize: '11px', marginTop: '16px', textAlign: 'center', maxWidth: '500px', lineHeight: 1.6 }}>
        <strong style={{ color: '#e8899c' }}>Tip:</strong> Use arrow keys ← → to navigate. Download individual slides or all at once.
      </p>
    </div>
  );
}
