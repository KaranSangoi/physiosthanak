'use client';

import { useEffect } from 'react';

// Fires GA4 events for high-intent clicks so they can be imported
// into Google Ads as conversions. Attached once, site-wide.
export function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', name, {
      page_path: window.location.pathname,
      ...params,
    });
  }
}

export default function AnalyticsEvents() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest?.('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        trackEvent('phone_click');
      } else if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        // WhatsApp links with our pre-filled booking text are "Book" CTAs;
        // anything else is a generic WhatsApp contact click.
        if (href.toLowerCase().includes('book')) {
          trackEvent('booking_click');
        } else {
          trackEvent('whatsapp_click');
        }
      } else if (href.includes('topmate.io')) {
        // Legacy paid booking (Instagram audience only)
        trackEvent('booking_click');
      }
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
