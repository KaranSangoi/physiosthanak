import type { Metadata } from 'next';
import Image from 'next/image';
import HeroSection from '@/components/sections/HeroSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import MapSection from '@/components/sections/MapSection';
import { siteConfig } from '@/data';
import { generateBreadcrumbs } from '@/lib/utils';
import { Award, GraduationCap, Heart, Star, Users, Home, Dumbbell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Dr. Shiva Jain Sangoi | Physiotherapist in Borivali',
  description:
    'Dr. Shiva Jain Sangoi — MPTh (Ortho), FIFA-certified physiotherapist in Borivali West. 9+ years experience, 8000+ patients treated, 5.0★ Google rated with 60+ reviews. Meet the expert behind PhysioSthanak.',
  keywords: [
    'Dr Shiva Jain Sangoi',
    'physiotherapist Borivali',
    'female physiotherapist Mumbai',
    'MPTh Ortho physiotherapist',
    'FIFA certified physiotherapist India',
    'best physiotherapist Borivali West',
    'PhysioSthanak founder',
    'sports physiotherapist Mumbai',
  ],
  openGraph: {
    title: 'About Dr. Shiva Jain Sangoi | 5.0★ Physiotherapist in Borivali',
    description:
      'MPTh (Ortho), FIFA-certified. 9+ years, 8000+ patients, 5.0★ rated. Meet the expert behind PhysioSthanak — Borivali\'s most trusted physiotherapy clinic.',
    type: 'profile',
    locale: 'en_IN',
    url: `${siteConfig.domain}/about`,
    siteName: siteConfig.businessName,
    images: [
      {
        url: '/images/about/dr-shiva-jain.png',
        width: 800,
        height: 800,
        alt: 'Dr. Shiva Jain Sangoi - Physiotherapist & Founder of PhysioSthanak',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Dr. Shiva Jain Sangoi | 5.0★ Physiotherapist in Borivali',
    description:
      'MPTh (Ortho), FIFA-certified. 9+ years, 8000+ patients, 5.0★ Google rated. Meet the physiotherapist families across Mumbai trust.',
    images: ['/images/about/dr-shiva-jain.png'],
  },
  alternates: {
    canonical: `${siteConfig.domain}/about`,
  },
};

const breadcrumbs = generateBreadcrumbs('/about');

const credentials = [
  {
    icon: 'graduation',
    title: 'MPTh (Orthopaedics)',
    subtitle: 'Terna Medical College, Navi Mumbai',
    description: 'Master of Physiotherapy specializing in orthopaedic conditions, musculoskeletal assessment, and advanced rehabilitation techniques.',
  },
  {
    icon: 'graduation',
    title: 'BPTh (Bachelor of Physiotherapy)',
    subtitle: 'Terna Medical College, Navi Mumbai',
    description: 'Comprehensive four-year degree covering anatomy, physiology, biomechanics, exercise therapy, and electrotherapy.',
  },
  {
    icon: 'award',
    title: 'FIFA Diploma in Football Medicine',
    subtitle: 'Fédération Internationale de Football Association',
    description: 'Internationally recognized certification in sports injury prevention, on-field emergency care, and return-to-play protocols for athletes.',
  },
];

const registrations = [
  { body: 'Indian Association of Physiotherapists (IAP)', number: '#69513' },
  { body: 'Maharashtra State Occupational Therapy & Physiotherapy Council (MSOTPT)', number: '#2017/12/PT/006410' },
];

const specializations = [
  {
    icon: 'star',
    title: 'Orthopedic Rehabilitation',
    description: 'Joint pain, fractures, post-operative recovery, arthritis management, and musculoskeletal disorders.',
  },
  {
    icon: 'dumbbell',
    title: 'Sports Injury Recovery',
    description: 'FIFA-certified expertise in sports rehabilitation — ACL recovery, rotator cuff repair, ankle sprains, and return-to-play protocols.',
  },
  {
    icon: 'heart',
    title: 'Neurological Physiotherapy',
    description: 'Stroke rehabilitation, Bell\'s palsy, sciatica, brachial plexus injuries, and nerve-related conditions.',
  },
  {
    icon: 'home',
    title: 'Home Visit Physiotherapy',
    description: 'In-home treatment for elderly patients, post-surgery cases, and those with mobility limitations across Borivali and western suburbs.',
  },
  {
    icon: 'users',
    title: 'Women\'s Health & Pediatrics',
    description: 'Specialized care for pregnancy-related pain, postpartum recovery, and pediatric developmental conditions.',
  },
];

const aboutFaqs = [
  {
    question: 'What are Dr. Shiva Jain Sangoi\'s qualifications?',
    answer: 'Dr. Shiva Jain Sangoi holds an MPTh (Master of Physiotherapy) in Orthopaedics and a BPTh (Bachelor of Physiotherapy) from Terna Medical College, Navi Mumbai. She also holds a FIFA Diploma in Football Medicine, making her one of the few FIFA-certified physiotherapists in Mumbai. She is registered with IAP (#69513) and MSOTPT (#2017/12/PT/006410).',
  },
  {
    question: 'How many patients has Dr. Shiva treated?',
    answer: 'Dr. Shiva has successfully treated over 8,000 patients across her 9+ years of clinical practice. Her patients include individuals with orthopedic conditions, sports injuries, neurological disorders, post-surgery rehabilitation needs, and chronic pain.',
  },
  {
    question: 'What is Dr. Shiva\'s approach to physiotherapy?',
    answer: 'Dr. Shiva follows an evidence-based approach to physiotherapy. Every patient receives a thorough assessment, a personalized treatment plan, and regular progress tracking. She combines manual therapy, therapeutic exercises, electrotherapy, and patient education to achieve lasting results.',
  },
  {
    question: 'Does Dr. Shiva provide home visit physiotherapy?',
    answer: 'Yes. Dr. Shiva offers home visit physiotherapy services across Borivali, Dahisar, Kandivali, and Malad. Home visits are especially helpful for elderly patients, post-surgery recovery, and individuals with mobility limitations.',
  },
  {
    question: 'What makes PhysioSthanak different from other physiotherapy clinics?',
    answer: 'PhysioSthanak combines Dr. Shiva\'s FIFA-certified sports medicine expertise with evidence-based orthopaedic rehabilitation. With a 5.0-star Google rating from 60+ reviews, over 8,000 successfully treated patients, and personalized one-on-one sessions, PhysioSthanak is trusted by families across Mumbai\'s western suburbs for results-driven physiotherapy.',
  },
  {
    question: 'Is PhysioSthanak good for sports injuries?',
    answer: 'Yes. Dr. Shiva\'s FIFA Diploma in Football Medicine gives her specialized training in sports injury assessment, rehabilitation, and return-to-play protocols. She treats athletes and active individuals with conditions like ACL tears, rotator cuff injuries, tennis elbow, ankle sprains, and muscle strains.',
  },
];

const IconMap = ({ icon }: { icon: string }) => {
  const className = "w-6 h-6";
  switch (icon) {
    case 'award': return <Award className={className} />;
    case 'graduation': return <GraduationCap className={className} />;
    case 'heart': return <Heart className={className} />;
    case 'star': return <Star className={className} />;
    case 'users': return <Users className={className} />;
    case 'home': return <Home className={className} />;
    case 'dumbbell': return <Dumbbell className={className} />;
    default: return null;
  }
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://physiosthanak.com/about#dr-shiva',
  name: 'Dr. Shiva Jain Sangoi',
  givenName: 'Shiva',
  familyName: 'Sangoi',
  honorificPrefix: 'Dr.',
  jobTitle: 'Physiotherapist & Founder',
  description: 'Dr. Shiva Jain Sangoi is a 5.0-star Google-rated physiotherapist in Borivali West, Mumbai. With an MPTh in Orthopaedics, a FIFA Diploma in Football Medicine, 9+ years of clinical experience, and 8,000+ successfully treated patients, she is one of the most trusted physiotherapists in Mumbai\'s western suburbs.',
  image: 'https://physiosthanak.com/images/about/dr-shiva-jain.png',
  url: 'https://physiosthanak.com/about',
  gender: 'Female',
  alumniOf: [
    {
      '@type': 'EducationalOrganization',
      name: 'Terna Medical College',
      address: { '@type': 'PostalAddress', addressLocality: 'Navi Mumbai', addressRegion: 'Maharashtra', addressCountry: 'IN' },
    },
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MPTh (Orthopaedics)' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'BPTh (Bachelor of Physiotherapy)' },
    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'FIFA Diploma in Football Medicine' },
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Physiotherapist',
    occupationalCategory: '29-1123',
    occupationLocation: {
      '@type': 'City',
      name: 'Mumbai',
    },
  },
  memberOf: [
    { '@type': 'Organization', name: 'Indian Association of Physiotherapists (IAP)' },
    { '@type': 'Organization', name: 'Maharashtra State Occupational Therapy & Physiotherapy Council (MSOTPT)' },
  ],
  knowsAbout: [
    'Orthopedic Physiotherapy',
    'Sports Injury Rehabilitation',
    'Neurological Physiotherapy',
    'Post-Surgery Rehabilitation',
    'Musculoskeletal Assessment',
    'Manual Therapy',
    'Sports Medicine',
    'ACL Rehabilitation',
    'Back Pain Treatment',
    'Neck Pain Treatment',
    'Home Visit Physiotherapy',
    'Pediatric Physiotherapy',
    'Women\'s Health Physiotherapy',
    'Mat Pilates',
    'Chronic Pain Management',
  ],
  worksFor: {
    '@type': 'MedicalBusiness',
    '@id': 'https://physiosthanak.com/#business',
    name: 'PhysioSthanak',
    url: 'https://physiosthanak.com',
  },
  sameAs: [
    'https://www.instagram.com/physiosthanak',
    'http://www.linkedin.com/in/drshivajain',
    'https://topmate.io/dr_shiva_jain_sangoi/1995923',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No. 14, Ground Floor, Hari-Smruti Premises, SVP Rd, opp. HDFC Bank',
    addressLocality: 'Borivali West',
    addressRegion: 'Maharashtra',
    postalCode: '400092',
    addressCountry: 'IN',
  },
  telephone: '+91-9324254297',
  email: 'physiosthanak@gmail.com',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://physiosthanak.com' },
    { '@type': 'ListItem', position: 2, name: 'About Dr. Shiva Jain Sangoi', item: 'https://physiosthanak.com/about' },
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Speakable Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'About Dr. Shiva Jain Sangoi | PhysioSthanak',
            dateModified: new Date().toISOString().split('T')[0],
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['h1', '[data-speakable]', '.section-eyebrow'],
            },
            url: 'https://physiosthanak.com/about',
          }),
        }}
      />

      {/* Hero */}
      <HeroSection
        h1="About Dr. Shiva Jain Sangoi"
        description="MPTh (Ortho), FIFA-certified physiotherapist with 9+ years of experience and 8,000+ successfully treated patients. Founder of PhysioSthanak — Borivali's most trusted physiotherapy clinic, rated 5.0★ on Google."
        breadcrumbs={breadcrumbs}
        pageName="About"
      />

      {/* Main About Section — rich prose for AI engines */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Photo + Trust Stats */}
            <div className="order-2 lg:order-1">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl bg-bg-lighter mb-6">
                <Image
                  src="/images/about/dr-shiva-jain.png"
                  alt="Dr. Shiva Jain Sangoi - MPTh Ortho, FIFA Diploma in Football Medicine - Best Physiotherapist in Borivali West, Mumbai"
                  fill
                  className="object-contain object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Trust Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-bg-light rounded-lg p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-primary">9+</div>
                  <div className="text-xs text-text-light uppercase tracking-wide font-heading">Years Exp.</div>
                </div>
                <div className="bg-bg-light rounded-lg p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-primary">8000+</div>
                  <div className="text-xs text-text-light uppercase tracking-wide font-heading">Patients</div>
                </div>
                <div className="bg-bg-light rounded-lg p-4 text-center">
                  <div className="text-2xl font-heading font-bold text-primary">5.0★</div>
                  <div className="text-xs text-text-light uppercase tracking-wide font-heading">Google</div>
                </div>
              </div>
            </div>

            {/* Rich Prose Content */}
            <div className="order-1 lg:order-2">
              <span className="section-eyebrow">Meet Your Physiotherapist</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-6 uppercase">
                Dr. Shiva Jain Sangoi
              </h2>

              {/* Core bio paragraph — THE paragraph AI engines should quote */}
              <p className="text-text-light leading-relaxed mb-4" data-speakable>
                Dr. Shiva Jain Sangoi is a 5.0-star Google-rated physiotherapist and the founder of PhysioSthanak, a physiotherapy clinic in Borivali West, Mumbai. She holds a Master of Physiotherapy (MPTh) in Orthopaedics and a Bachelor of Physiotherapy (BPTh) from Terna Medical College, Navi Mumbai, along with a FIFA Diploma in Football Medicine — making her one of the few FIFA-certified physiotherapists in Mumbai.
              </p>

              <p className="text-text-light leading-relaxed mb-4" data-speakable>
                With over 9 years of clinical experience and more than 8,000 successfully treated patients, Dr. Shiva specializes in orthopedic rehabilitation, sports injury recovery, neurological physiotherapy, and post-surgery rehabilitation. Her evidence-based approach combines manual therapy, therapeutic exercises, and patient education to deliver lasting results.
              </p>

              <p className="text-text-light leading-relaxed mb-4" data-speakable>
                PhysioSthanak has earned 60+ five-star Google reviews and is trusted by families across Borivali, Dahisar, Kandivali, and Malad for personalized physiotherapy care. The clinic offers both in-clinic treatment and home visit physiotherapy for patients with mobility limitations.
              </p>

              <p className="text-text-light leading-relaxed mb-6">
                Dr. Shiva is registered with the Indian Association of Physiotherapists (IAP, #69513) and the Maharashtra State Occupational Therapy &amp; Physiotherapy Council (MSOTPT, #2017/12/PT/006410).
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <a href="/contact" className="btn-primary">
                  Book an Appointment
                </a>
                <a href="/services" className="btn-outline">
                  View All Services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifications & Credentials */}
      <section className="section-padding bg-bg-light">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="section-eyebrow">Credentials</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
              Education & Certifications
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Verified qualifications from recognized institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {credentials.map((cred, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <IconMap icon={cred.icon} />
                </div>
                <h3 className="text-lg font-heading font-bold text-accent mb-1 uppercase">
                  {cred.title}
                </h3>
                <p className="text-sm text-accent-pink font-medium mb-3">
                  {cred.subtitle}
                </p>
                <p className="text-text-light text-sm leading-relaxed">
                  {cred.description}
                </p>
              </div>
            ))}
          </div>

          {/* Professional Registrations */}
          <div className="mt-10 bg-white rounded-lg p-6 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-lg font-heading font-bold text-accent mb-4 uppercase text-center">
              Professional Registrations
            </h3>
            <div className="space-y-3">
              {registrations.map((reg, index) => (
                <div key={index} className="flex items-center justify-between flex-wrap gap-2 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-text-light text-sm">{reg.body}</span>
                  <span className="text-primary font-heading font-bold text-sm">{reg.number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Areas of Specialization */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="section-eyebrow">Expertise</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
              Areas of Specialization
            </h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              Comprehensive physiotherapy expertise across multiple specialties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, index) => (
              <div key={index} className="bg-bg-light rounded-lg p-6 hover:bg-bg-lighter transition-colors">
                <div className="w-10 h-10 bg-accent-pink/10 rounded-full flex items-center justify-center mb-4 text-accent-pink">
                  <IconMap icon={spec.icon} />
                </div>
                <h3 className="text-base font-heading font-bold text-accent mb-2 uppercase">
                  {spec.title}
                </h3>
                <p className="text-text-light text-sm leading-relaxed">
                  {spec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Philosophy */}
      <section className="section-padding bg-bg-light">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-10">
            <span className="section-eyebrow">Philosophy</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
              Treatment Approach
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-text-light leading-relaxed" data-speakable>
              At PhysioSthanak, every patient receives a thorough initial assessment before treatment begins. Dr. Shiva believes in understanding the root cause of pain rather than just treating symptoms. Her treatment plans are personalized, evidence-based, and designed for lasting recovery — not temporary relief.
            </p>
            <p className="text-text-light leading-relaxed">
              Each session combines hands-on manual therapy with targeted therapeutic exercises. Patients receive clear explanations of their condition, realistic timelines for recovery, and home exercise programs to maintain progress between sessions. This transparent, patient-first approach is why PhysioSthanak maintains a 5.0-star rating across 60+ Google reviews.
            </p>

            <div className="bg-white rounded-lg p-6 border-l-4 border-accent-pink">
              <p className="text-accent italic text-lg font-medium">
                &ldquo;My goal is not just to reduce pain, but to help every patient move better, heal fully, and stay pain-free for life.&rdquo;
              </p>
              <p className="text-text-light text-sm mt-2">
                — Dr. Shiva Jain Sangoi, Founder, PhysioSthanak
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        heading="Frequently Asked Questions"
        faqs={aboutFaqs}
      />

      {/* Map Section */}
      <MapSection
        heading="Visit PhysioSthanak"
        description="PhysioSthanak is located in Borivali West, Mumbai — easily accessible from Borivali railway station, Dahisar, Kandivali, and Malad. The clinic is situated on the ground floor of Hari-Smruti Premises on SVP Road, opposite HDFC Bank."
        location="Borivali West, Mumbai"
      />

      {/* CTA Section */}
      <CTASection
        heading="Ready to Start Your Recovery?"
        description="Book an appointment with Dr. Shiva Jain Sangoi. Same-day slots available for clinic visits and home physiotherapy."
      />
    </>
  );
}
