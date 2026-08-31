import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'World Physiotherapy Day — Free Assessment Week | Sep 6-14',
  description:
    'Celebrate World Physiotherapy Day with PhysioSthanak: a free full-body assessment week at our Borivali West clinic, Sep 6-14, with a special camp day on Sep 8.',
  alternates: {
    canonical: `${siteConfig.domain}/physiotherapy-day`,
  },
  openGraph: {
    title: 'World Physiotherapy Day — Free Assessment Week',
    description:
      'Free full-body physiotherapy assessments at PhysioSthanak, Borivali West, Sep 6-14. Camp day on World Physiotherapy Day, Sep 8.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/physiotherapy-day`,
    siteName: siteConfig.businessName,
  },
};

const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, '')}`;
const waHref = `https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
  'Hi Dr. Shiva, I would like to book my free assessment during Physiotherapy Day week.',
)}`;

const events = [
  {
    dates: 'Sep 6 – 14',
    title: 'Free Full-Body Assessment Week',
    text: 'Walk in or book a slot any day of the week at our Borivali West clinic. Dr. Shiva Jain Sangoi personally assesses how you stand, sit, bend and move — the full root-cause evaluation — completely free. No obligation to continue.',
  },
  {
    dates: 'Sep 8 · World Physiotherapy Day',
    title: 'Camp Day at the Clinic',
    text: 'On World Physiotherapy Day itself, we run special camp hours: back-to-back free assessments, posture screenings, and honest answers to the aches you have been ignoring. Slots go fastest on this day — book early.',
  },
  {
    dates: 'All week',
    title: 'Bring Someone You Worry About',
    text: 'A parent whose knees complain on stairs. A colleague who lives with neck stiffness. Anyone whose ache has quietly become part of their routine. One careful assessment often explains years of discomfort — and this week, it costs nothing to find out.',
  },
];

const faqs = [
  {
    q: 'Is the assessment really free? What is the catch?',
    a: 'There is no catch. The first consultation at our clinic has always been free — Physiotherapy Day week simply celebrates it louder, with camp hours on Sep 8. If you need treatment, Dr. Shiva will say so honestly. If you are doing fine, she will happily tell you that too.',
  },
  {
    q: 'How do I book a slot?',
    a: 'Call or WhatsApp us on +91 93242 54297, or use the booking button on this page. Walk-ins are welcome through the week, but booked slots are seen first — evening and camp-day slots fill fastest.',
  },
  {
    q: 'Who should come for an assessment?',
    a: 'Anyone with back pain, neck pain, knee pain, an old injury that never fully settled, post-surgery stiffness, or a daily ache that has become part of the routine. Seniors and desk workers especially — one assessment often explains years of discomfort.',
  },
  {
    q: 'I am not in Mumbai — can I consult online?',
    a: 'Yes — online video consultations with Dr. Shiva are available as a regular paid service, booked after payment and confirmation. The free assessment week applies to in-clinic visits at Borivali West.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'World Physiotherapy Day — Free Assessment Week at PhysioSthanak',
  startDate: '2026-09-06',
  endDate: '2026-09-14',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'PhysioSthanak - Physiotherapy Center in Borivali',
    address: siteConfig.address,
  },
  organizer: {
    '@type': 'MedicalBusiness',
    name: siteConfig.businessName,
    url: siteConfig.domain,
  },
  isAccessibleForFree: true,
  description:
    'Free full-body physiotherapy assessment week at PhysioSthanak, Borivali West, celebrating World Physiotherapy Day with a camp day on September 8.',
};

export default function PhysiotherapyDayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="section-padding bg-primary text-white">
        <div className="container-max text-center">
          <p className="text-accent-pink font-heading uppercase tracking-widest text-sm mb-4">
            Sep 6 – 14 · Free Assessment Week
          </p>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold uppercase tracking-wide">
            World Physiotherapy Day
          </h1>
          <p className="mt-6 text-white/85 max-w-2xl mx-auto text-lg leading-relaxed">
            Physiotherapy has one job we take seriously above all: find the root cause,
            never just mask the symptom. This World Physiotherapy Day, we are celebrating
            the profession the best way we know — a full week of free assessments for
            Borivali.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={waHref} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Book Free Assessment
            </a>
            <a href={phoneHref} className="btn-outline-white">
              Call {siteConfig.phone}
            </a>
          </div>
          <p className="mt-4 text-white/60 text-sm">Move . Heal . Improve</p>
        </div>
      </section>

      {/* What's on */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-accent uppercase text-center mb-12">
            Physiotherapy Day Week — What&rsquo;s On
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {events.map((e) => (
              <div key={e.title} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <p className="text-accent-pink font-heading uppercase tracking-wide text-sm mb-2">
                  {e.dates}
                </p>
                <h3 className="font-heading font-bold text-lg text-accent mb-3">{e.title}</h3>
                <p className="text-text-light leading-relaxed text-sm">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="section-padding bg-gray-50">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-accent uppercase mb-6">
            Why a Whole Week Free?
          </h2>
          <p className="text-text-light leading-relaxed mb-4">
            Because assessment-first care is the whole point of this clinic.
            {' '}{siteConfig.doctorName} — MPTh (Ortho), BPTh, FIFA Diploma in Football
            Medicine, with 10+ years and 8000+ cases — built PhysioSthanak on a habit most
            clinics skip: understanding the whole body before treating any part of it.
          </p>
          <p className="text-text-light leading-relaxed mb-8">
            A proper assessment is the most valuable thing we do, and for one week it is
            our gift to the neighbourhood. Rated 5.0 on Google by the people of Borivali.
          </p>
          <Link href="/" className="text-accent-pink font-heading uppercase tracking-wide">
            Learn more about PhysioSthanak →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-accent uppercase text-center mb-10">
            Physiotherapy Day Week FAQs
          </h2>
          <div className="space-y-8">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-heading font-bold text-accent mb-2">{f.q}</h3>
                <p className="text-text-light leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a href={waHref} className="btn-primary" target="_blank" rel="noopener noreferrer">
              WhatsApp Us — Book Your Free Slot
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
