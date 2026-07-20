'use client';

import { useState, FormEvent } from 'react';
import { trackEvent } from '@/components/AnalyticsEvents';

const WEB3FORMS_KEY = '97e35895-6350-4c20-982e-f2fdb1996900';
const BOOKING_URL = 'https://topmate.io/dr_shiva_jain_sangoi/1995923';

interface HeroFormProps {
  pageName?: string;
  bookingUrl?: string;
}

export default function HeroForm({
  pageName = 'Unknown Page',
  bookingUrl,
}: HeroFormProps) {
  const activeBookingUrl = bookingUrl || BOOKING_URL;
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('submitting');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          cc: formData.email,
          replyto: formData.email,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          source_page: pageName,
          subject: `Consultation Request Received — PhysioSthanak`,
          from_name: 'PhysioSthanak',
          botcheck: '',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormState('success');
        trackEvent('form_submit_lead', { source_page: pageName });
        window.open(activeBookingUrl, '_blank');
        setTimeout(() => {
          setFormState('idle');
          setFormData({ name: '', phone: '', email: '' });
        }, 5000);
      } else {
        setErrorDetail(`Web3Forms: ${data.message || 'Unknown error'}`);
        setFormState('error');
      }
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setFormState('error');
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 border-t-4 border-t-accent-pink">
      <h3 className="text-2xl font-heading font-bold text-accent mb-2 uppercase">
        Book Your Slot
      </h3>
      <p className="text-text-light text-sm mb-6">
        Fill in your details and we&apos;ll help you book a slot
      </p>

      {formState === 'success' ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-heading font-bold text-accent mb-2">Thank You!</p>
          <p className="text-text-light text-sm mb-4">
            Your details have been sent. Please pick a time slot in the booking page that just opened.
          </p>
          <a
            href={activeBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-pink font-heading font-bold text-sm uppercase tracking-wide hover:underline"
          >
            Didn&apos;t open? Click here to book →
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="botcheck" className="hidden" style={{ display: 'none' }} />
          <div>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={formState === 'submitting'}
            className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {formState === 'submitting' ? 'Sending...' : 'Book Your Slot'}
          </button>

          {formState === 'error' && (
            <div className="text-red-500 text-sm text-center space-y-1">
              <p>Something went wrong. Please call us directly.</p>
              {errorDetail && (
                <p className="text-xs text-red-400 bg-red-50 p-2 rounded font-mono break-all">
                  Debug: {errorDetail}
                </p>
              )}
            </div>
          )}
        </form>
      )}
      <p className="text-xs text-text-light text-center mt-4">
        We&apos;ll respond within 2 hours
      </p>
    </div>
  );
}
