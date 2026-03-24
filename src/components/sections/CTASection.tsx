import { siteConfig } from '@/data/site-config';

interface CTASectionProps {
  heading: string;
  description: string;
}

export default function CTASection({ heading, description }: CTASectionProps) {
  return (
    <section className="section-padding-lg bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container-max text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          {heading}
        </h2>
        <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-8">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Book Appointment
          </a>
          <a
            href={`tel:${siteConfig.phone}`}
            className="inline-block px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors"
          >
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
