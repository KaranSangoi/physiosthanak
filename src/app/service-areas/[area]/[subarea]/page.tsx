import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import WhySection from '@/components/sections/WhySection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import MapSection from '@/components/sections/MapSection';
import Link from 'next/link';
import { serviceAreas, siteConfig, allServices } from '@/data';
import { getSubAreaBySlug, generateBreadcrumbs } from '@/lib/utils';
import { Benefit, WhyPoint } from '@/types';

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

  const subAreaBenefits: Benefit[] = [
    {
      title: 'Easy Access to Care',
      description: `Located right in ${subAreaData.name}, we provide convenient access to expert physiotherapy without long travel times.`,
    },
    {
      title: 'Home Visit Services',
      description: `Professional physiotherapy delivered to your home in ${subAreaData.name}. Perfect for elderly, post-surgery, and mobility-limited patients.`,
    },
    {
      title: 'Comprehensive Services',
      description: `All our physiotherapy services are available in ${subAreaData.name}, from pain management to sports injury treatment.`,
    },
  ];

  const whyChooseSubArea: WhyPoint[] = [
    {
      title: 'Local Expert Treatment',
      description: `Get expert care from Dr. Shiva Jain right in your ${subAreaData.name} neighborhood with personalized treatment plans.`,
    },
    {
      title: 'Flexible Options',
      description: `Choose between clinic-based treatment or convenient home visit services, both available in ${subAreaData.name}.`,
    },
    {
      title: 'Quick Recovery',
      description: `Timely access to expert physiotherapy in ${subAreaData.name} helps you recover faster and prevent complications.`,
    },
  ];

  const subAreaFaqs = [
    {
      question: `Do you provide home physiotherapy in ${subAreaData.name}?`,
      answer: `Yes, we provide professional home visit physiotherapy services in ${subAreaData.name}. Call us to schedule your appointment.`,
    },
    {
      question: 'How do I book an appointment?',
      answer: `You can book online through our Google Calendar link or call us directly. We offer flexible scheduling for clinic and home visits.`,
    },
    {
      question: 'What conditions are treated?',
      answer: `We treat all conditions including back pain, neck pain, sports injuries, post-surgery recovery, arthritis, and more in ${subAreaData.name}.`,
    },
    {
      question: 'Is a doctor referral required?',
      answer: 'No, a doctor referral is not mandatory, though it can help with insurance claims. We accept patients with or without referral.',
    },
  ];

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

      {/* Hero Section */}
      <HeroSection
        h1={subAreaData.h1}
        description={subAreaData.description}
        breadcrumbs={breadcrumbs}
      />

      {/* Benefits Section */}
      <BenefitsSection
        heading={`Physiotherapy Services in ${subAreaData.name}`}
        benefits={subAreaBenefits}
      />

      {/* Why Section */}
      <WhySection
        heading={`Why Choose PhysioSthanak in ${subAreaData.name}?`}
        whyPoints={whyChooseSubArea}
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
                className="bg-white rounded-lg p-6 card-shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-accent mb-2 hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-text-light text-sm line-clamp-2">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        heading="Frequently Asked Questions"
        subheading={`About physiotherapy services in ${subAreaData.name}`}
        faqs={subAreaFaqs}
      />

      {/* Map Section */}
      <MapSection
        heading={`Physiotherapy Care for ${subAreaData.name}`}
        description={`Our clinic in Borivali West serves ${subAreaData.name} with convenient location and home visit options for expert physiotherapy treatment.`}
        location="Borivali, Mumbai"
      />

      {/* CTA with Links */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready for Expert Physiotherapy in {subAreaData.name}?
          </h2>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-8">
            Book your consultation with Dr. Shiva Jain today. Available for
            clinic visits and home physiotherapy services in{' '}
            {subAreaData.name}. Also explore our complete{' '}
            <Link href="/" className="underline hover:text-gray-200">
              PhysioSthanak services
            </Link>
            .
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
