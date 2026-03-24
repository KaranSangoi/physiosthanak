import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import WhySection from '@/components/sections/WhySection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import MapSection from '@/components/sections/MapSection';
import ServiceCard from '@/components/sections/ServiceCard';
import AreaCard from '@/components/sections/AreaCard';
import { siteConfig, allServices, serviceAreas } from '@/data';
import { Benefit, WhyPoint } from '@/types';

export const metadata: Metadata = {
  title: 'Best Physiotherapist in Borivali | PhysioSthanak',
  description:
    'Expert physiotherapy services in Borivali by Dr. Shiva Jain. 9+ years experience, 8000+ cases treated. Book your consultation today.',
  keywords: [
    'physiotherapy Borivali',
    'best physiotherapist Borivali',
    'physical therapy',
    'pain management',
    'sports injuries',
    'rehabilitation',
    'home physiotherapy',
  ],
  openGraph: {
    title: 'Best Physiotherapist in Borivali | PhysioSthanak',
    description:
      'Expert physiotherapy services in Borivali by Dr. Shiva Jain. 9+ years experience, 8000+ cases treated. Book today.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}`,
    siteName: siteConfig.businessName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PhysioSthanak - Expert Physiotherapy in Borivali',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Physiotherapist in Borivali | PhysioSthanak',
    description:
      'Expert physiotherapy services in Borivali by Dr. Shiva Jain. 9+ years experience, 8000+ cases treated.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: siteConfig.domain,
  },
};

const trustIndicators: Benefit[] = [
  {
    title: '9+ Years Experience',
    description:
      'Trusted by thousands of patients with proven expertise in physiotherapy and rehabilitation.',
  },
  {
    title: '8000+ Cases Treated',
    description:
      'Successfully treated over 8000 patients with diverse conditions and requirements.',
  },
  {
    title: 'Home Visits Available',
    description:
      'Convenient home-based physiotherapy services for patients with mobility limitations.',
  },
];

const aboutPoints: WhyPoint[] = [
  {
    title: 'Dr. Shiva Jain Sangoi',
    description:
      'BPTh with 9+ years of clinical experience in comprehensive physiotherapy and rehabilitation services.',
  },
  {
    title: 'Evidence-Based Treatment',
    description:
      'Utilizes latest evidence-based physiotherapy techniques for optimal patient outcomes.',
  },
  {
    title: 'Comprehensive Services',
    description:
      'Offers 11+ specialized physiotherapy services covering pain management to sports injuries.',
  },
];

const whyChoose: WhyPoint[] = [
  {
    title: 'Expert Personalized Care',
    description:
      'Every patient receives a tailored treatment plan designed specifically for their condition, goals, and lifestyle.',
  },
  {
    title: 'Proven Track Record',
    description:
      'With 9+ years of experience and 8000+ successfully treated cases, we have the expertise you can trust.',
  },
  {
    title: 'Convenient & Accessible',
    description:
      'Flexible scheduling, home visit options, and multiple service areas across Borivali ensure accessibility.',
  },
];

const homeFaqs = [
  {
    question: 'What conditions can physiotherapy treat?',
    answer:
      'Physiotherapy treats a wide range of conditions including back pain, neck pain, sports injuries, post-surgery recovery, neurological conditions, arthritis, and mobility issues. We offer specialized treatment for 11+ different categories of physiotherapy services.',
  },
  {
    question: 'How long does a physiotherapy session last?',
    answer:
      'A typical physiotherapy session lasts 45-60 minutes, including assessment, treatment, and exercises. The duration may vary based on your specific condition and treatment needs.',
  },
  {
    question: 'Do I need a doctor\'s referral to start physiotherapy?',
    answer:
      'While not mandatory, a doctor\'s referral can be helpful for insurance claims and medical coordination. We can accept patients with or without a referral and can coordinate with your physician.',
  },
  {
    question: 'How many sessions will I need?',
    answer:
      'The number of sessions varies based on condition severity and individual response to treatment. Most patients see improvement within 4-6 sessions, though chronic conditions may require longer treatment.',
  },
  {
    question: 'Do you offer home visit physiotherapy?',
    answer:
      'Yes, we offer home visit physiotherapy services across Borivali and surrounding areas. This is especially beneficial for elderly patients, post-surgery cases, and those with mobility limitations.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection
        h1="Best Physiotherapist in Borivali"
        description="Expert physiotherapy services for pain relief, injury recovery, and improved mobility. 9+ years experience, 8000+ cases treated. Personalized treatment plans in clinic and at home."
        breadcrumbs={[]}
        showForm={false}
      />

      {/* Trust Indicators */}
      <section className="section-padding bg-bg-lighter">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-3">
                  {['9+', '8000+', '∞'][index]}
                </div>
                <h3 className="text-xl font-bold text-accent mb-2">
                  {indicator.title}
                </h3>
                <p className="text-text-light">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
              Our Physiotherapy Services
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Comprehensive physiotherapy treatment for various conditions and
              patient needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.slice(0, 11).map((service) => (
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

      {/* About Dr. Shiva */}
      <WhySection
        heading="About Dr. Shiva Jain Sangoi"
        subheading="Expert physiotherapist with proven results and patient trust"
        whyPoints={aboutPoints}
      />

      {/* Why Choose Section */}
      <BenefitsSection
        heading="Why Choose PhysioSthanak?"
        subheading="The best physiotherapy care in Borivali for your recovery"
        benefits={whyChoose.map((point) => ({
          title: point.title,
          description: point.description,
        }))}
      />

      {/* Testimonials Placeholder */}
      <section className="section-padding bg-bg-lighter">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
            Patient Testimonials
          </h2>
          <p className="text-lg text-text-light mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied patients who have benefited from our
            expert physiotherapy services
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-8 card-shadow">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-text-light mb-4">
                  &quot;Excellent physiotherapy services. Dr. Shiva is very
                  professional and caring. Highly recommended!&quot;
                </p>
                <p className="font-semibold text-accent">Patient {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
              Service Areas
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Professional physiotherapy services across Borivali and surrounding
              areas
            </p>
          </div>

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

      {/* FAQ Section */}
      <FAQSection
        heading="Frequently Asked Questions"
        subheading="Everything you need to know about our physiotherapy services"
        faqs={homeFaqs}
      />

      {/* Map Section */}
      <MapSection
        heading="Visit Our Clinic"
        description="Located in the heart of Borivali West, our state-of-the-art clinic provides convenient access and comfortable treatment environment."
        location="Borivali, Mumbai"
      />

      {/* Final CTA */}
      <CTASection
        heading="Ready to Start Your Recovery?"
        description="Book your consultation with Dr. Shiva Jain today. Take the first step toward pain relief and improved mobility."
      />
    </>
  );
}
