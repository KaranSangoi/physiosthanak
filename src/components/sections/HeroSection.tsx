'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const WEB3FORMS_KEY = '97e35895-6350-4c20-982e-f2fdb1996900';
const BOOKING_URL = 'https://topmate.io/dr_shiva_jain_sangoi/1995923';

interface HeroSectionProps {
  h1: string;
  description: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  backgroundImage?: string;
  showForm?: boolean;
  isHome?: boolean;
  pageName?: string;
  bookingUrl?: string;
}

export default function HeroSection({
  h1,
  description,
  breadcrumbs,
  backgroundImage,
  showForm = true,
  isHome = false,
  pageName = 'Unknown Page',
  bookingUrl: customBookingUrl,
}: HeroSectionProps) {
  const activeBookingUrl = customBookingUrl || BOOKING_URL;
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
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
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          source_page: pageName,
          subject: `New Consultation Request from ${pageName} - PhysioSthanak`,
          from_name: 'PhysioSthanak Website',
          botcheck: '',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormState('success');
        // Open Google Calendar booking in new tab
        window.open(activeBookingUrl, '_blank');
        // Reset after 5 seconds
        setTimeout(() => {
          setFormState('idle');
          setFormData({ name: '', phone: '', email: '' });
        }, 5000);
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  }

  return (
    <section className={`relative overflow-hidden ${isHome ? 'py-20 md:py-28' : 'py-16'} bg-[#0e1b2d]`}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e1b2d]/95 to-[#0e1b2d]/60 z-10" />

      {/* Background image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={`${h1} - physiotherapy treatment`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Default subtle pattern when no image */}
      {!backgroundImage && (
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 2px, transparent 0)',
            backgroundSize: '50px 50px',
          }} />
        </div>
      )}

      <div className="container-max px-4 relative z-20">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} dark />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            {isHome && (
              <span className="inline-block bg-accent-pink/20 text-accent-pink border border-accent-pink/30 px-4 py-1.5 rounded-full text-sm font-heading font-medium uppercase tracking-wider">
                Expert Physiotherapy in Borivali
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight uppercase">
              {h1}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={activeBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-center"
              >
                Book Appointment
              </a>
              <a
                href="tel:+919324254297"
                className="btn-outline-white text-center"
              >
                Call Now
              </a>
            </div>

            {/* Social proof */}
            {isHome && (
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <span className="text-slate-400 text-sm font-medium">8000+ Happy Patients</span>
              </div>
            )}
          </div>

          {/* Lead Capture Form */}
          {showForm && (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-4 sm:p-6 md:p-8 border-t-4 border-t-accent-pink">
              <h3 className="text-2xl font-heading font-bold text-accent mb-2 uppercase">
                Get Your Free Consultation
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
                  {/* Honeypot */}
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
                    {formState === 'submitting' ? 'Sending...' : 'Book Free Consultation'}
                  </button>

                  {formState === 'error' && (
                    <p className="text-red-500 text-sm text-center">
                      Something went wrong. Please call us directly.
                    </p>
                  )}
                </form>
              )}
              <p className="text-xs text-text-light text-center mt-4">
                We&apos;ll respond within 2 hours
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
