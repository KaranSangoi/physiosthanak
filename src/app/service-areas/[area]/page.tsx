import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import WhySection from '@/components/sections/WhySection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import MapSection from '@/components/sections/MapSection';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { serviceAreas, siteConfig } from '@/data';
import { getAreaBySlug, generateBreadcrumbs } from '@/lib/utils';

// Rotating physio images for Why section with SEO-optimized alt tags
const whyImages = [
  { src: '/images/services/physiotherapy.jpg', altTemplate: 'Professional physiotherapy treatment session in' },
  { src: '/images/services/back-pain-physiotherapy.jpg', altTemplate: 'Back pain physiotherapy and rehabilitation near' },
  { src: '/images/services/sports-physiotherapy.jpg', altTemplate: 'Sports injury physiotherapy treatment in' },
  { src: '/images/services/orthopedic-physiotherapy.jpg', altTemplate: 'Orthopedic physiotherapy consultation near me in' },
];

interface PageProps {
  params: Promise<{
    area: string;
  }>;
}

export async function generateStaticParams() {
  return serviceAreas.map((area) => ({
    area: area.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params;
  const areaData = getAreaBySlug(area);

  if (!areaData) {
    return {
      title: 'Area Not Found',
    };
  }

  return {
    title: areaData.h1,
    description: areaData.metaDescription,
    keywords: areaData.keywords,
    openGraph: {
      title: areaData.h1,
      description: areaData.metaDescription,
      type: 'website',
      locale: 'en_IN',
      url: `${siteConfig.domain}/service-areas/${areaData.slug}`,
      siteName: siteConfig.businessName,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: areaData.name,
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.domain}/service-areas/${areaData.slug}`,
    },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { area } = await params;
  const areaData = getAreaBySlug(area);

  if (!areaData) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs(`/service-areas/${area}`);

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.businessName,
    description: areaData.description,
    url: `${siteConfig.domain}/service-areas/${areaData.slug}`,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        'Shop No. 14, Ground Floor, Hari-Smruti Premises, Sardar Vallabhbhai Patel Rd, opp. HDFC Bank',
      addressLocality: 'Borivali West',
      addressRegion: 'Mumbai',
      postalCode: '400092',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: areaData.name,
    },
    serviceType: 'Physiotherapy',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* HERO SECTION - per SOP: H1 with location+service, hero desc 35-40 words, form with tracking */}
      <HeroSection
        h1={areaData.h1}
        description={areaData.heroDescription}
        breadcrumbs={breadcrumbs}
        pageName={`Area: ${areaData.name}`}
      />

      {/* BENEFITS SECTION - per SOP: 3 unique USP bullets, 35+ words each, with location+service */}
      <BenefitsSection
        heading={`Physiotherapy Services in ${areaData.name}`}
        benefits={areaData.benefits}
      />

      {/* WHY SECTION - per SOP: 3 unique points about why physio matters in this location */}
      <WhySection
        heading={`Why Physiotherapy Matters in ${areaData.name}`}
        whyPoints={areaData.whyPoints}
        image={whyImages[serviceAreas.indexOf(areaData) % whyImages.length].src}
        imageAlt={`${whyImages[serviceAreas.indexOf(areaData) % whyImages.length].altTemplate} ${areaData.name}`}
      />

      {/* Sub-Areas Grid */}
      {areaData.subAreas && areaData.subAreas.length > 0 && (
        <section className="section-padding bg-bg-lighter">
          <div className="container-max">
            <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4 text-center">
              Service Areas in {areaData.name}
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto mb-12 text-center">
              We serve multiple sub-areas across {areaData.name} with clinic and
              home visit services
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {areaData.subAreas.map((subArea) => (
                <Link
                  key={subArea.slug}
                  href={`/service-areas/${areaData.slug}/${subArea.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden card-shadow h-full hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <h3 className="text-xl font-heading font-bold text-accent group-hover:text-primary transition-colors uppercase">
                        {subArea.name}
                      </h3>
                    </div>
                    <p className="text-text-light text-sm leading-relaxed mb-4 flex-grow">
                      {subArea.description}
                    </p>
                    <div className="flex items-center gap-2 text-accent-pink font-heading font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
                      Explore Service Area
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ SECTION - per SOP: 3 unique SEO-optimized Q&As specific to location */}
      <FAQSection
        heading="Frequently Asked Questions"
        subheading={`About our services in ${areaData.name}`}
        faqs={areaData.faqs}
      />

      {/* MAP SECTION - per SOP: 50+ word description with primary keyword, location-specific map */}
      <MapSection
        heading={`Visit Our Clinic Serving ${areaData.name}`}
        description={areaData.mapDescription}
        location={`${areaData.name}, Mumbai`}
        mapQuery={`${areaData.name} Mumbai Maharashtra`}
      />

      {/* CTA SECTION - per SOP: 1 external link (Wikipedia) + 1 internal link (homepage) */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Book Your Appointment in {areaData.name}
          </h2>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-4">
            Get expert physiotherapy services right in {areaData.name}. Call us
            today or book online for clinic or home visit services at{' '}
            <Link href="/" className="underline hover:text-gray-200">
              PhysioSthanak
            </Link>
            .
          </p>
          {areaData.externalLink && (
            <p className="text-sm text-gray-200 max-w-2xl mx-auto mb-8">
              Learn more about{' '}
              <a
                href={areaData.externalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                {areaData.externalLink.text}
              </a>{' '}
              and the community we proudly serve.
            </p>
          )}

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
    </>
  );
}
