import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import HeroForm from './HeroForm';

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
          {/* Text Content — server-rendered for fast LCP */}
          <div className="space-y-6">
            {isHome && (
              <span className="inline-block bg-accent-pink/20 text-accent-pink border border-accent-pink/30 px-4 py-1.5 rounded-full text-sm font-heading font-medium uppercase tracking-wider">
                Expert Physiotherapy in Borivali
              </span>
            )}

            {/* Visual headline for USERS — the offer. (The SEO H1 sits below, smaller.) */}
            <div>
              <p className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-tight uppercase">
                First Consultation{' '}
                <span className="text-accent-pink">FREE</span>
              </p>
              <p className="text-lg sm:text-xl text-white/90 font-medium mt-2">
                Pay only for treatment sessions — no hidden charges.
              </p>
            </div>

            {/* SEO H1 — keeps keyword targeting, visually a supporting line */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white/95 leading-snug uppercase">
              {h1}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
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

          {/* Lead Capture Form — client component (only interactive part) */}
          {showForm && (
            <HeroForm pageName={pageName} bookingUrl={customBookingUrl} />
          )}
        </div>
      </div>
    </section>
  );
}
