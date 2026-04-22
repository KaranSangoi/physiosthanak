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
.cs .slide-watermark { position: absolute; bottom: 30px; right: 40px; z-index: 2; opacity: 0.15; }
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
}: CarouselPreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [copyLabel, setCopyLabel] = useState('📋 Copy Caption + Hashtags');

  const total = slides.length;
  const slideNames = ['Cover', 'Why This Matters', 'Mistake #1', 'Mistake #2', 'Mistake #3', 'Mistake #4', 'Mistake #5', 'Red Flags', 'Self-Check', 'CTA'];

  const nav = (dir: number) => {
    const n = currentSlide + dir;
    if (n >= 0 && n < total) setCurrentSlide(n);
  };

  // Load html2canvas and jszip from CDN
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const script1 = document.createElement('script');
    script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script1.async = true;
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script2.async = true;
    document.head.appendChild(script2);
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
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

          <div className="slide-watermark"><img src="/images/horizontal-logo.png" alt="PhysioSthanak" /></div>
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
          <div className="slide-watermark"><img src="/images/horizontal-logo.png" alt="PhysioSthanak" /></div>
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
          <div className="slide-watermark"><img src="/images/horizontal-logo.png" alt="PhysioSthanak" /></div>
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

          <div className="slide-watermark"><img src="/images/horizontal-logo.png" alt="PhysioSthanak" /></div>
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
        </div>
      );
    }

    return <div style={{width:'1080px',height:'1080px',background:'#0a0a0a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Poppins'}}>Slide {idx}</div>;
  };

  /* ============================================================
     Download functions
     ============================================================ */
  const downloadSlide = async (index: number) => {
    const html2canvas = (window as any).html2canvas;
    if (!html2canvas) { setStatusMessage('html2canvas not loaded yet'); return; }

    setDownloading(true);
    setStatusMessage(`Rendering slide ${index + 1}...`);

    try {
      const slideEl = slideRefs.current[index];
      if (!slideEl) { setStatusMessage('Slide element not found'); return; }

      // Temporarily show at full size for capture
      slideEl.style.display = 'block';
      slideEl.style.transform = 'none';
      slideEl.style.marginBottom = '0';
      slideEl.style.borderRadius = '0';
      await new Promise(r => setTimeout(r, 200));

      const innerSlide = slideEl.firstElementChild as HTMLElement;
      const canvas = await html2canvas(innerSlide || slideEl, {
        width: 1080, height: 1080, scale: 1,
        useCORS: true, backgroundColor: null, allowTaint: true,
      });

      // Restore
      slideEl.style.transform = '';
      slideEl.style.marginBottom = '';
      slideEl.style.borderRadius = '';
      slideEl.style.display = index === currentSlide ? 'block' : 'none';

      canvas.toBlob((blob: Blob) => {
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
        const slideEl = slideRefs.current[i];
        if (!slideEl) continue;

        // Temporarily show at full size for capture
        slideEl.style.display = 'block';
        slideEl.style.transform = 'none';
        slideEl.style.marginBottom = '0';
        slideEl.style.borderRadius = '0';
        await new Promise(r => setTimeout(r, 200));

        const innerSlide = slideEl.firstElementChild as HTMLElement;
        const canvas = await html2canvas(innerSlide || slideEl, {
          width: 1080, height: 1080, scale: 1,
          useCORS: true, backgroundColor: null, allowTaint: true,
        });

        // Restore
        slideEl.style.transform = '';
        slideEl.style.marginBottom = '';
        slideEl.style.borderRadius = '';
        slideEl.style.display = i === currentSlide ? 'block' : 'none';

        const blob = await new Promise<Blob>(resolve => {
          canvas.toBlob((b: Blob | null) => resolve(b as Blob));
        });
        folder?.file(`slide-${String(i + 1).padStart(2, '0')}.png`, blob);
        await new Promise(r => setTimeout(r, 300));
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

  /* ============================================================
     Render — same layout as instagram-carousel.html
     ============================================================ */
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

      {/* Carousel — one slide at a time */}
      <div className="carousel-wrapper">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            ref={el => { slideRefs.current[idx] = el; }}
            className="slide-container"
            style={{ display: idx === currentSlide ? 'block' : 'none' }}
          >
            {renderSlide(slide)}
          </div>
        ))}
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
        <button className="dl-btn" onClick={() => downloadSlide(currentSlide)} disabled={downloading}>
          📥 Download This Slide
        </button>
        <button className="dl-btn primary" onClick={downloadAllSlides} disabled={downloading}>
          📥 Download All {total} Slides
        </button>
      </div>

      {statusMessage && <div className="status-text">{statusMessage}</div>}

      {/* Caption Box */}
      {caption && (
        <div className="caption-box">
          <div className="caption-label">Ready-to-Post Caption</div>
          <div className="caption-text" id="captionContent">{caption}</div>
          {hashtags && (
            <div className="caption-hashtags" id="captionHashtags">{hashtags}</div>
          )}
          <button className="copy-btn" onClick={copyCaption}>{copyLabel}</button>
        </div>
      )}

      <p style={{ color: '#64748b', fontSize: '11px', marginTop: '16px', textAlign: 'center', maxWidth: '500px', lineHeight: 1.6 }}>
        <strong style={{ color: '#e8899c' }}>Tip:</strong> Use arrow keys ← → to navigate. Download individual slides or all at once.
      </p>
    </div>
  );
}
