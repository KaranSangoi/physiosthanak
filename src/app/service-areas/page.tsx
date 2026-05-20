import type { Metadata } from 'next';
import AreaCard from '@/components/sections/AreaCard';
import MapSection from '@/components/sections/MapSection';
import { serviceAreas, siteConfig } from '@/data';
import { generateBreadcrumbs } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Physiotherapy Service Areas in Mumbai | PhysioSthanak',
  description:
    'Professional physiotherapy services across Borivali and surrounding areas in Mumbai. Home visit and clinic services available.',
  keywords: [
    'service areas',
    'Borivali',
    'Mumbai',
    'physiotherapy',
    'home visit',
    'locations',
  ],
  openGraph: {
    title: 'Physiotherapy Service Areas in Mumbai | PhysioSthanak',
    description:
      'Professional physiotherapy services across Borivali and surrounding areas with home visit options.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/service-areas`,
    siteName: siteConfig.businessName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PhysioSthanak Service Areas',
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.domain}/service-areas`,
  },
};

const breadcrumbs = generateBreadcrumbs('/service-areas');

export default function ServiceAreasPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="container-max px-4 py-8">
        <nav className="flex gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-text-light">/</span>}
              {item.href ? (
                <a href={item.href} className="text-primary hover:text-primary-dark">
                  {item.label}
                </a>
              ) : (
                <span className="text-text-light">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Header */}
      <section className="section-padding bg-bg-lighter">
        <div className="container-max">
          <h1 className="text-4xl sm:text-5xl font-bold text-accent mb-4">
            Physiotherapy Service Areas in Mumbai
          </h1>
          <p className="text-xl text-text-light max-w-3xl">
            We provide professional physiotherapy services across Borivali and
            surrounding areas of{' '}
            <a href="https://en.wikipedia.org/wiki/Mumbai" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:underline">Mumbai</a>.
            Choose your location to explore our services and
            convenient home visit options.
          </p>
        </div>
      </section>

      {/* Service Areas Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceAreas.map((area) => (
              <AreaCard
                key={area.slug}
                name={area.name}
                slug={area.slug}
                description={area.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <MapSection
        heading="Service Coverage Map"
        description="We serve the entire Borivali region with clinic-based and home visit physiotherapy services. Our convenient location and mobile services ensure you get expert care wherever you are."
        location="Borivali, Mumbai"
      />
    </>
  );
}
