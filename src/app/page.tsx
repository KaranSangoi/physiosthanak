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
import { Clock, Users, Home } from 'lucide-react';

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

const trustIndicators = [
  {
    icon: 'clock',
    number: '9+',
    title: 'Years Experience',
    description: 'Trusted by thousands of patients with proven expertise in physiotherapy.',
  },
  {
    icon: 'users',
    number: '8000+',
    title: 'Cases Treated',
    description: 'Successfully treated patients with diverse conditions and requirements.',
  },
  {
    icon: 'home',
    number: '∞',
    title: 'Home Visits Available',
    description: 'Convenient home-based physiotherapy for patients with mobility limitations.',
  },
];

const aboutPoints: WhyPoint[] = [
  {
    title: 'Dr. Shiva Jain Sangoi',
    description:
      'MPTh (Ortho), BPTh with FIFA Diploma in Football Medicine. 9+ years of clinical experience in comprehensive physiotherapy and rehabilitation services.',
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

const whyChoose: Benefit[] = [
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

const IconMap = ({ icon }: { icon: string }) => {
  const className = "w-6 h-6 text-white";
  switch (icon) {
    case 'clock': return <Clock className={className} />;
    case 'users': return <Users className={className} />;
    case 'home': return <Home className={className} />;
    default: return null;
  }
};

const medicalBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': 'https://physiosthanak.com/#business',
  name: 'PhysioSthanak',
  alternateName: 'PhysioSthanak - Physiotherapy Center',
  url: 'https://physiosthanak.com',
  logo: 'https://physiosthanak.com/images/Logo.png',
  image: [
    'https://physiosthanak.com/og-image.jpg',
    'https://physiosthanak.com/images/Logo.png',
    'https://physiosthanak.com/images/about/dr-shiva-jain.png',
  ],
  description: 'Expert physiotherapy clinic in Borivali West, Mumbai led by Dr. Shiva Jain Sangoi, MPTh (Ortho) with FIFA Diploma in Football Medicine. Specializing in orthopedic rehabilitation, sports injuries, neurological physiotherapy, and home visit services. 9+ years experience, 8000+ cases treated.',
  medicalSpecialty: [
    'Musculoskeletal',
    'Orthopedic',
    'Sports Medicine',
    'Neurological',
    'Pediatric',
  ],
  availableService: [
    { '@type': 'MedicalTherapy', name: 'Physiotherapy', serviceType: 'Physical Therapy' },
    { '@type': 'MedicalTherapy', name: 'Home Visit Physiotherapy', serviceType: 'Home Health Care' },
    { '@type': 'MedicalTherapy', name: 'Sports Physiotherapy', serviceType: 'Sports Medicine' },
    { '@type': 'MedicalTherapy', name: 'Post-Surgery Rehabilitation', serviceType: 'Rehabilitation' },
    { '@type': 'MedicalTherapy', name: 'Neurological Physiotherapy', serviceType: 'Neurological Therapy' },
    { '@type': 'MedicalTherapy', name: 'Orthopedic Physiotherapy', serviceType: 'Orthopedic Therapy' },
    { '@type': 'MedicalTherapy', name: 'Pediatric Physiotherapy', serviceType: 'Pediatric Therapy' },
    { '@type': 'MedicalTherapy', name: 'Women\'s Health Physiotherapy', serviceType: 'Women Health' },
    { '@type': 'MedicalTherapy', name: 'Hand & Wrist Physiotherapy', serviceType: 'Hand Therapy' },
    { '@type': 'MedicalTherapy', name: 'Online Physiotherapy', serviceType: 'Telehealth' },
  ],
  founder: {
    '@type': 'Person',
    name: 'Dr. Shiva Jain Sangoi',
    jobTitle: 'Physiotherapist & Founder',
    description: 'MPTh (Ortho), BPTh, FIFA Diploma in Football Medicine. 9+ years of clinical experience with 8000+ cases treated.',
    image: 'https://physiosthanak.com/images/about/dr-shiva-jain.png',
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MPTh (Orthopaedics)' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'BPTh' },
      { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'FIFA Diploma in Football Medicine' },
    ],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No. 14, Ground Floor, Hari-Smruti Premises, Sardar Vallabhbhai Patel Rd, opp. HDFC Bank',
    addressLocality: 'Borivali West',
    addressRegion: 'Maharashtra',
    postalCode: '400092',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '19.2288',
    longitude: '72.8563',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9324254297',
    contactType: 'appointments',
    availableLanguage: ['English', 'Hindi', 'Marathi'],
  },
  telephone: '+91-9324254297',
  email: 'physiosthanak@gmail.com',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, UPI, Debit Card, Credit Card',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '00:00',
      closes: '00:00',
      description: 'By Appointment Only',
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Borivali' },
    { '@type': 'City', name: 'Dahisar' },
    { '@type': 'City', name: 'Kandivali' },
    { '@type': 'City', name: 'Malad' },
  ],
  sameAs: [
    'https://www.instagram.com/physiosthanak',
    'http://www.linkedin.com/in/drshivajain',
    'https://topmate.io/dr_shiva_jain_sangoi/1995923',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '50',
    reviewCount: '50',
  },
  isAcceptingNewPatients: true,
};

export default function HomePage() {
  return (
    <>
      {/* MedicalBusiness + AggregateRating JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalBusinessSchema) }}
      />

      {/* Hero Section */}
      <HeroSection
        h1="Best Physiotherapist in Borivali"
        description="Expert physiotherapy services for pain relief, injury recovery, and improved mobility. 9+ years experience, 8000+ cases treated. Personalized treatment plans in clinic and at home."
        breadcrumbs={[]}
        isHome
        showForm
        pageName="Homepage"
      />

      {/* Trust Indicators */}
      <section className="section-padding bg-white border-b border-slate-100">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex flex-col items-center p-6 rounded-lg hover:bg-bg-light transition-colors text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                  <IconMap icon={indicator.icon} />
                </div>
                <div className="text-3xl font-heading font-bold text-primary mb-2">
                  {indicator.number}
                </div>
                <h3 className="text-lg font-heading font-bold text-accent uppercase mb-2">
                  {indicator.title}
                </h3>
                <p className="text-text-light text-sm">{indicator.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-bg-light">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="section-eyebrow">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
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
        eyebrow="About the Expert"
        heading="About Dr. Shiva Jain Sangoi"
        subheading="Expert physiotherapist with proven results and patient trust"
        whyPoints={aboutPoints}
        image="/images/about/dr-shiva-jain.png"
        imageAlt="Dr. Shiva Jain Sangoi - MPTh Ortho, FIFA Diploma - Best Physiotherapist in Borivali"
      />

      {/* Why Choose Section */}
      <BenefitsSection
        heading="Why Choose PhysioSthanak?"
        subheading="The best physiotherapy care in Borivali for your recovery"
        benefits={whyChoose}
      />

      {/* Testimonials - Google Reviews via Elfsight */}
      <section className="section-padding bg-bg-light">
        <div className="container-max text-center">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Real Results from Real Patients
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <span className="font-heading font-bold text-accent uppercase tracking-wide text-sm">
              5.0 Rating
            </span>
          </div>
          <p className="text-lg text-text-light mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied patients who have benefited from our
            expert physiotherapy services
          </p>

          <div
            id="featurable-8f844505-6165-4a48-bebf-6a5e4aceaa54"
            data-featurable-async
          />
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="section-eyebrow">Coverage</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
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
