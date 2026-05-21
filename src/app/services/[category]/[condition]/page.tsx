import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import WhySection from '@/components/sections/WhySection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import MapSection from '@/components/sections/MapSection';
import RelatedBlogPosts from '@/components/sections/RelatedBlogPosts';
import Link from 'next/link';
import { allServices, siteConfig } from '@/data';
import {
  getConditionBySlug,
  generateBreadcrumbs,
  getAllServiceSlugs,
} from '@/lib/utils';

interface PageProps {
  params: Promise<{
    category: string;
    condition: string;
  }>;
}

export async function generateStaticParams() {
  const slugs: { category: string; condition: string }[] = [];

  allServices.forEach((service) => {
    if (service.conditions && service.conditions.length > 0) {
      service.conditions.forEach((condition) => {
        slugs.push({
          category: service.slug,
          condition: condition.slug,
        });
      });
    }
  });

  return slugs;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, condition } = await params;
  const conditionData = getConditionBySlug(category, condition);

  if (!conditionData) {
    return {
      title: 'Condition Not Found',
    };
  }

  return {
    title: conditionData.h1,
    description: conditionData.metaDescription,
    keywords: conditionData.keywords,
    openGraph: {
      title: conditionData.h1,
      description: conditionData.metaDescription,
      type: 'website',
      locale: 'en_IN',
      url: `${siteConfig.domain}/services/${category}/${condition}`,
      siteName: siteConfig.businessName,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: conditionData.name,
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.domain}/services/${category}/${condition}`,
    },
  };
}

export default async function ConditionPage({ params }: PageProps) {
  const { category, condition } = await params;
  const conditionData = getConditionBySlug(category, condition);

  if (!conditionData) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs(
    `/services/${category}/${condition}`
  );

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: conditionData.name,
    description: conditionData.description,
    provider: {
      '@type': 'MedicalBusiness',
      name: siteConfig.businessName,
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
      url: siteConfig.domain,
    },
    areaServed: {
      '@type': 'City',
      name: 'Mumbai',
      '@context': 'https://schema.org',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Hero Section */}
      <HeroSection
        h1={conditionData.h1}
        description={conditionData.heroDescription}
        breadcrumbs={breadcrumbs}
        pageName={`Condition: ${conditionData.name}`}
      />

      {/* Benefits Section */}
      <BenefitsSection
        heading={`Benefits of Treatment for ${conditionData.name}`}
        benefits={conditionData.benefits}
      />

      {/* Why Section */}
      <WhySection
        heading={`Why Choose PhysioSthanak for ${conditionData.name}?`}
        whyPoints={conditionData.whyPoints}
      />

      {/* FAQ Section */}
      <FAQSection
        heading="Common Questions About This Condition"
        faqs={conditionData.faqs}
      />

      {/* Map Section */}
      <MapSection
        heading="Visit Our Clinic in Borivali"
        description="Located conveniently in Borivali West, our clinic is equipped to provide expert treatment for your condition."
        location="Borivali, Mumbai"
      />

      {/* Related Blog Posts */}
      <RelatedBlogPosts serviceSlug={category} />

      {/* CTA with Homepage Link */}
      <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Your Recovery Today
          </h2>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-8">
            Expert treatment for {conditionData.name} by{' '}
            <Link
              href="/"
              className="underline hover:text-gray-200"
            >
              PhysioSthanak
            </Link>
            . Book your consultation now.
            {conditionData.externalLink && (
              <>
                {' '}Learn more about{' '}
                <a
                  href={conditionData.externalLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-pink hover:underline"
                >
                  {conditionData.externalLink.text}
                </a>.
              </>
            )}
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
    </>
  );
}
