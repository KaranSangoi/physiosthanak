import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import WhySection from '@/components/sections/WhySection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import ServiceCard from '@/components/sections/ServiceCard';
import { allServices, siteConfig } from '@/data';
import { getServiceBySlug, generateBreadcrumbs, getAllServiceSlugs } from '@/lib/utils';

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return allServices.map((service) => ({
    category: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  const service = getServiceBySlug(category);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: service.h1,
    description: service.metaDescription,
    keywords: service.keywords,
    openGraph: {
      title: service.h1,
      description: service.metaDescription,
      type: 'website',
      locale: 'en_IN',
      url: `${siteConfig.domain}/services/${service.slug}`,
      siteName: siteConfig.businessName,
      images: [
        {
          url: service.image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: service.name,
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.domain}/services/${service.slug}`,
    },
  };
}

export default async function ServiceCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const service = getServiceBySlug(category);

  if (!service) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs(`/services/${category}`);

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.businessName,
    description: service.description,
    url: `${siteConfig.domain}/services/${service.slug}`,
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
    offers: {
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: {
        '@type': 'MedicalBusiness',
        name: siteConfig.doctorName,
      },
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
        h1={service.h1}
        description={service.heroDescription}
        breadcrumbs={breadcrumbs}
        backgroundImage={service.image}
        pageName={`Service: ${service.name}`}
        bookingUrl={service.slug === 'online-physiotherapy' ? 'https://topmate.io/dr_shiva_jain_sangoi/1995923' : undefined}
      />

      {/* Benefits Section */}
      <BenefitsSection
        heading={`Benefits of ${service.name}`}
        subheading="Experience the advantages of professional physiotherapy care"
        benefits={service.benefits}
      />

      {/* Why Section */}
      <WhySection
        heading={`Why Choose PhysioSthanak for ${service.name}?`}
        subheading="Expert care with proven results"
        whyPoints={service.whyPoints}
      />

      {/* Conditions Grid */}
      {service.conditions && service.conditions.length > 0 && (
        <section className="section-padding bg-bg-lighter">
          <div className="container-max">
            <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4 text-center">
              Related Conditions We Treat
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto mb-12 text-center">
              Specialized treatment for specific conditions within {service.name}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.conditions.map((condition) => (
                <ServiceCard
                  key={condition.slug}
                  name={condition.name}
                  slug={`${service.slug}/${condition.slug}`}
                  description={condition.description}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection
        heading="Frequently Asked Questions"
        subheading={`Common questions about ${service.name}`}
        faqs={service.faqs}
      />

      {/* CTA Section */}
      <CTASection
        heading={`Ready for Expert ${service.name} Treatment?`}
        description="Book your consultation with Dr. Shiva Jain today and start your path to recovery."
      />
    </>
  );
}
