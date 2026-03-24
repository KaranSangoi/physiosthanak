import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import WhySection from '@/components/sections/WhySection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import MapSection from '@/components/sections/MapSection';
import Link from 'next/link';
import { serviceAreas, siteConfig } from '@/data';
import { getAreaBySlug, generateBreadcrumbs } from '@/lib/utils';
import { Benefit, WhyPoint } from '@/types';

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

  const areaBenefits: Benefit[] = [
    {
      title: 'Convenient Location',
      description: `Located in the heart of ${areaData.name}, our clinic is easily accessible with ample parking and convenient public transport options.`,
    },
    {
      title: 'Professional Home Visit Services',
      description: `We provide professional physiotherapy at your home in ${areaData.name}, perfect for elderly patients, post-surgery recovery, and those with mobility limitations.`,
    },
    {
      title: 'All Services Available',
      description: `Access our complete range of physiotherapy services in ${areaData.name}, from pain management to sports injuries and post-operative care.`,
    },
  ];

  const whyChooseArea: WhyPoint[] = [
    {
      title: 'Local Expert Care',
      description: `Our clinic in ${areaData.name} serves the local community with personalized, expert physiotherapy treatment by experienced professionals.`,
    },
    {
      title: 'Flexible Scheduling',
      description: `We offer flexible appointment times and home visit options to fit your schedule and lifestyle in ${areaData.name}.`,
    },
    {
      title: 'Quick Access to Expert Care',
      description: `No need to travel far for expert physiotherapy. Get professional treatment right in your area with convenient location and home services.`,
    },
  ];

  const areaFaqs = [
    {
      question: `Do you provide services in ${areaData.name}?`,
      answer: `Yes, we provide comprehensive physiotherapy services in ${areaData.name} including clinic-based treatment and home visit services for your convenience.`,
    },
    {
      question: 'What areas within your service region do you cover?',
      answer: `We serve multiple sub-areas within the ${areaData.name} region. Contact us to confirm if your specific location is covered by our home visit services.`,
    },
    {
      question: 'How do I book a home visit in my area?',
      answer: `Simply call us or use our online booking system to schedule a home visit. We'll confirm availability for your specific location in ${areaData.name}.`,
    },
    {
      question: 'Are travel charges included for home visits?',
      answer: 'Travel charges may apply for areas beyond 10 kilometers from our clinic. Please contact us for specific pricing for your location.',
    },
  ];

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

      {/* Hero Section */}
      <HeroSection
        h1={areaData.h1}
        description={areaData.description}
        breadcrumbs={breadcrumbs}
      />

      {/* Benefits Section */}
      <BenefitsSection
        heading={`Physiotherapy Services in ${areaData.name}`}
        benefits={areaBenefits}
      />

      {/* Why Section */}
      <WhySection
        heading={`Why Choose PhysioSthanak in ${areaData.name}?`}
        whyPoints={whyChooseArea}
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
                >
                  <div className="bg-white rounded-lg overflow-hidden card-shadow h-full hover:shadow-xl transition-all duration-300 p-6">
                    <h3 className="text-xl font-bold text-accent mb-3 hover:text-primary transition-colors">
                      {subArea.name}
                    </h3>
                    <p className="text-text-light text-sm leading-relaxed">
                      {subArea.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection
        heading="Frequently Asked Questions"
        subheading={`About our services in ${areaData.name}`}
        faqs={areaFaqs}
      />

      {/* Map Section */}
      <MapSection
        heading={`Visit Our Clinic Serving ${areaData.name}`}
        description={`Located in Borivali West, our clinic serves ${areaData.name} and surrounding areas with professional physiotherapy treatment and home visit services.`}
        location="Borivali, Mumbai"
      />

      {/* CTA with External Link */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Book Your Appointment in {areaData.name}
          </h2>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-8">
            Get expert physiotherapy services right in {areaData.name}. Call us
            today or book online for clinic or home visit services.
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
    </>
  );
}
