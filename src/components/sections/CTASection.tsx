import { siteConfig } from '@/data/site-config';

interface CTASectionProps {
  heading: string;
  description: string;
}

export default function CTASection({ heading, description }: CTASectionProps) {
  return (
    <section className="section-padding-lg bg-[#0e1b2d] text-white relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 2px, transparent 0)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container-max text-center relative z-10">
        <span className="section-eyebrow">Get Started Today</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6 uppercase text-white">
          {heading}
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-accent-pink text-white font-heading font-bold rounded-md uppercase tracking-wider hover:bg-accent-pink/90 transition-all shadow-lg hover:shadow-xl"
          >
            Book Appointment
          </a>
          <a
            href={`tel:${siteConfig.phone}`}
            className="btn-outline-white"
          >
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
