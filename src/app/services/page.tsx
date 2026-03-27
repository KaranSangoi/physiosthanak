import type { Metadata } from 'next';
import ServiceCard from '@/components/sections/ServiceCard';
import { allServices, siteConfig } from '@/data';
import { generateBreadcrumbs } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Physiotherapy Services in Borivali',
  description:
    'Explore our comprehensive physiotherapy services including pain management, sports injuries, post-operative care, and more in Borivali.',
  keywords: [
    'physiotherapy services',
    'Borivali',
    'pain management',
    'sports injuries',
    'rehabilitation',
    'physical therapy',
  ],
  openGraph: {
    title: 'Physiotherapy Services in Borivali | PhysioSthanak',
    description:
      'Comprehensive physiotherapy services in Borivali including pain management, sports injuries, and rehabilitation.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/services`,
    siteName: siteConfig.businessName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PhysioSthanak Services',
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.domain}/services`,
  },
};

const breadcrumbs = generateBreadcrumbs('/services');

export default function ServicesPage() {
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
            Physiotherapy Services in Borivali
          </h1>
          <p className="text-xl text-text-light max-w-3xl">
            Explore our comprehensive range of{' '}
            <a href="https://en.wikipedia.org/wiki/Physical_therapy" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:underline">physical therapy</a>{' '}
            services designed to address various conditions and patient needs. From pain management
            to sports injuries and post-operative recovery, we provide
            evidence-based treatment delivered by experienced professionals.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service) => (
              <ServiceCard
                key={service.slug}
                name={service.name}
                slug={service.slug}
                description={service.description}
                image={service.image}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
