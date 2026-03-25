import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import WhySection from '@/components/sections/WhySection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import MapSection from '@/components/sections/MapSection';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { serviceAreas, siteConfig, allServices } from '@/data';
import { getSubAreaBySlug, generateBreadcrumbs } from '@/lib/utils';

// Rotating physio images for Why section with SEO-optimized alt tags
const whyImages = [
  { src: '/images/services/physiotherapy.jpg', altTemplate: 'Physiotherapy treatment near me in' },
  { src: '/images/services/home-visit-physiotherapy.jpg', altTemplate: 'Home visit physiotherapy services in' },
  { src: '/images/services/neck-pain-physiotherapy.jpg', altTemplate: 'Neck pain physiotherapy near' },
  { src: '/images/services/back-pain-physiotherapy.jpg', altTemplate: 'Back pain rehabilitation treatment in' },
  { src: '/images/services/sports-physiotherapy.jpg', altTemplate: 'Sports physiotherapy and injury recovery in' },
  { src: '/images/services/orthopedic-physiotherapy.jpg', altTemplate: 'Orthopedic physiotherapy services near' },
  { src: '/images/services/post-surgery-rehabilitation.jpg', altTemplate: 'Post-surgery rehabilitation physiotherapy in' },
  { src: '/images/services/neurological-physiotherapy.jpg', altTemplate: 'Neurological physiotherapy consultation in' },
  { src: '/images/services/hand-physiotherapy.jpg', altTemplate: 'Hand and wrist physiotherapy treatment near' },
  { src: '/images/services/pediatric-physiotherapy.jpg', altTemplate: 'Pediatric physiotherapy care in' },
  { src: '/images/services/womens-health-physiotherapy.jpg', altTemplate: 'Women health physiotherapy services in' },
];

interface PageProps {
  params: Promise<{
    area: string;
    subarea: string;
  }>;
}

export async function generateStaticParams() {
  const slugs: { area: string; subarea: string }[] = [];

  serviceAreas.forEach((area) => {
    area.subAreas.forEach((subArea) => {
      slugs.push({
        area: area.slug,
        subarea: subArea.slug,
      });
    });
  });

  return slugs;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { area, subarea } = await params;
  const subAreaData = getSubAreaBySlug(area, subarea);

  if (!subAreaData) {
    return {
      title: 'Sub-Area Not Found',
    };
  }

  return {
    title: subAreaData.h1,
    description: subAreaData.metaDescription,
    keywords: subAreaData.keywords,
    openGraph: {
      title: subAreaData.h1,
      description: subAreaData.metaDescription,
      type: 'website',
      locale: 'en_IN',
      url: `${siteConfig.domain}/service-areas/${area}/${subarea}`,
      siteName: siteConfig.businessName,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: subAreaData.name,
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.domain}/service-areas/${area}/${subarea}`,
    },
  };
}

export default async function SubAreaPage({ params }: PageProps) {
  const { area, subarea } = await params;
  const subAreaData = getSubAreaBySlug(area, subarea);

  if (!subAreaData) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs(`/service-areas/${area}/${subarea}`);

  // Pick a rotating image based on slug hash for unique images per page
  const imgIndex = subarea.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % whyImages.length;
  const whyImage = whyImages[imgIndex];

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.businessName,
    description: subAreaData.description,
    url: `${siteConfig.domain}/service-areas/${area}/${subarea}`,
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
      name: subAreaData.name,
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
        h1={subAreaData.h1}
        description={subAreaData.heroDescription}
        breadcrumbs={breadcrumbs}
        pageName={`SubArea: ${subAreaData.name} (${subAreaData.parentArea})`}
      />

      {/* BENEFITS SECTION - per SOP: 3 unique USP bullets, 35+ words each */}
      <BenefitsSection
        heading={`Physiotherapy Services in ${subAreaData.name}`}
        benefits={subAreaData.benefits}
      />

      {/* WHY SECTION - per SOP: 3 unique points about why physio matters in this location */}
      <WhySection
        heading={`Why Physiotherapy Matters in ${subAreaData.name}`}
        whyPoints={subAreaData.whyPoints}
        image={whyImage.src}
        imageAlt={`${whyImage.altTemplate} ${subAreaData.name}`}
      />

      {/* Services Available */}
      <section className="section-padding bg-bg-lighter">
        <div className="container-max">
          <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4 text-center">
            Services Available in {subAreaData.name}
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto mb-12 text-center">
            Explore the physiotherapy services we offer in {subAreaData.name}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allServices.slice(0, 8).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="bg-white rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow group flex flex-col"
              >
                <h3 className="text-lg font-heading font-bold text-accent mb-2 group-hover:text-primary transition-colors uppercase">
                  {service.name}
                </h3>
                <p className="text-text-light text-sm line-clamp-2 mb-4 flex-grow">
                  {service.description}
                </p>
                <div className="flex items-center gap-2 text-accent-pink font-heading font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
                  Explore Service
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION - per SOP: 3 unique SEO-optimized Q&As specific to location */}
      <FAQSection
        heading="Frequently Asked Questions"
        subheading={`About physiotherapy services in ${subAreaData.name}`}
        faqs={subAreaData.faqs}
      />

      {/* MAP SECTION - per SOP: 50+ word description with primary keyword, location-specific map */}
      <MapSection
        heading={`Physiotherapy Care for ${subAreaData.name}`}
        description={subAreaData.mapDescription}
        location={`${subAreaData.name}, Mumbai`}
        mapQuery={`${subAreaData.name} ${subAreaData.parentArea} Mumbai Maharashtra`}
      />

      {/* CTA SECTION - per SOP: 1 external link (Wikipedia) + 1 internal link (homepage) */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready for Expert Physiotherapy in {subAreaData.name}?
          </h2>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-4">
            Book your consultation with Dr. Shiva Jain today. Available for
            clinic visits and home physiotherapy services in{' '}
            {subAreaData.name}. Also explore our complete{' '}
            <Link href="/" className="underline hover:text-gray-200">
              PhysioSthanak services
            </Link>
            .
          </p>
          {subAreaData.externalLink && (
            <p className="text-sm text-gray-200 max-w-2xl mx-auto mb-8">
              Learn more about{' '}
              <a
                href={subAreaData.externalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                {subAreaData.externalLink.text}
              </a>{' '}
              and the surrounding areas we serve.
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
