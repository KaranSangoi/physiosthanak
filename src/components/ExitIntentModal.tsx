'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/data/site-config';

const WA_HREF = `https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
  'Hi Dr. Shiva, I would like to book my free first assessment.',
)}`;
const PHONE_HREF = `tel:${siteConfig.phone.replace(/\s/g, '')}`;
const SESSION_KEY = 'ps_exit_intent_shown';
const ARM_DELAY_MS = 12000; // don't interrupt fresh visitors
const MOBILE_DWELL_MS = 35000; // mobile fallback: show once after a real dwell

interface ExitIntentModalProps {
  /** Live review count, resolved on the server. Falls back to site-config. */
  reviewCount?: number;
}

export default function ExitIntentModal({ reviewCount }: ExitIntentModalProps = {}) {
  const reviews = reviewCount ?? siteConfig.reviewCount;
  const [open, setOpen] = useState(false);
  const armedRef = useRef(false);
  const shownRef = useRef(false);

  const show = useCallback(() => {
    if (shownRef.current) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage unavailable — still show once via ref */
    }
    shownRef.current = true;
    setOpen(true);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }

    const armTimer = window.setTimeout(() => {
      armedRef.current = true;
    }, ARM_DELAY_MS);

    // Desktop: cursor leaves through the top of the viewport (toward tabs/close)
    const onMouseOut = (e: MouseEvent) => {
      if (!armedRef.current) return;
      if (e.relatedTarget === null && e.clientY <= 0) show();
    };
    document.addEventListener('mouseout', onMouseOut);

    // Mobile fallback: one gentle prompt after a genuine dwell
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    let dwellTimer: number | undefined;
    if (isTouch) {
      dwellTimer = window.setTimeout(show, MOBILE_DWELL_MS);
    }

    return () => {
      window.clearTimeout(armTimer);
      if (dwellTimer) window.clearTimeout(dwellTimer);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Free first assessment offer"
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-3 top-3 h-8 w-8 rounded-full text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          ×
        </button>
        <p className="font-heading text-sm uppercase tracking-widest text-accent-pink">
          One second —
        </p>
        <h3 className="mt-2 font-heading text-2xl font-bold uppercase tracking-wide text-accent">
          Your First Assessment Is Free
        </h3>
        <p className="mt-4 leading-relaxed text-text-light">
          Before you go: {siteConfig.doctorName} assesses your whole body to find the
          root cause of pain — not just the symptom. The first consultation at our
          Borivali West clinic is completely free, by appointment.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            WhatsApp Us — Book Free Slot
          </a>
          <a href={PHONE_HREF} className="btn-outline w-full">
            Call {siteConfig.phone}
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          5.0★ on Google · {reviews}+ reviews · Borivali West
        </p>
      </div>
    </div>
  );
}
