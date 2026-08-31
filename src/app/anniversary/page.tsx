import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'PhysioSthanak Turns 1 — Free Assessment Week | Sep 6-14',
  description:
    'Celebrate our first anniversary on World Physiotherapy Day. Free full-body assessment camp in Borivali West + FREE online physiotherapy consultations across India, Sep 6-14.',
  alternates: {
    canonical: `${siteConfig.domain}/anniversary`,
  },
  openGraph: {
    title: 'PhysioSthanak Turns 1 — Free Assessment Week',
    description:
      'One year of finding root causes, not masking symptoms. Free assessment camp in Borivali West + free online consultations India-wide, Sep 6-14.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/anniversary`,
    siteName: siteConfig.businessName,
  },
};

const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, '')}`;
const waHref = `https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
  'Hi Dr. Shiva, I would like to book my free anniversary-week assessment.',
)}`;

const events = [
  {
    dates: 'Sep 6 – 14',
    title: 'Free Full-Body Assessment Week (At the Clinic)',
    text: 'Walk in or book a slot any day of anniversary week. Dr. Shiva Jain Sangoi personally assesses how you stand, sit, bend and move — the full root-cause evaluation that is normally the start of paid treatment — completely free. No obligation to continue.',
  },
  {
    dates: 'Sep 8 · World Physiotherapy Day',
    title: 'Anniversary Camp Day',
    text: 'Our first birthday falls on World Physiotherapy Day — the day this clinic was born. Special camp hours with back-to-back free assessments, posture screenings, and honest answers to the aches you have been ignoring.',
  },
  {
    dates: 'Sep 6 – 14',
    title: 'FREE Online Consultations — Anywhere in India',
    text: 'Not in Mumbai? For one week, video consultations with Dr. Shiva are free for anyone in India. Share your reports, show us how you move, and leave with a clear picture of what is actually going on — from your own home.',
  },
];

const faqs = [
  {
    q: 'Is the assessment really free? What is the catch?',
    a: 'There is no catch. The first consultation at PhysioSthanak has always been free — anniversary week simply extends the same promise louder, with camp hours and free online consultations across India. If you need treatment, Dr. Shiva will say so honestly. If you are doing fine, she will happily tell you that too.',
  },
  {
    q: 'How do I book a slot?',
    a: 'Call or WhatsApp us on +91 93242 54297, or use the booking button on this page. Walk-ins are welcome through anniversary week, but booked slots are seen first — evening slots fill fastest.',
  },
  {
    q: 'Who should come for an assessment?',
    a: 'Anyone with back pain, neck pain, knee pain, an old injury that never fully settled, post-surgery stiffness, or the kind of daily ache that has quietly become part of the routine. Seniors and desk workers especially — one careful assessment often explains years of discomfort.',
  },
  {
    q: 'What happens in the free online consultation?',
    a: 'A video call with Dr. Shiva Jain Sangoi, MPTh (Ortho). She will ask about your pain history, watch how you move on camera, review any reports you share, and give you two or three practical things to start the same day — plus an honest opinion on whether you need physiotherapy at all.',
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
  name: 'PhysioSthanak First Anniversary — Free Assessment Week',
  startDate: '2026-09-06',
  endDate: '2026-09-14',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
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
    'Free full-body physiotherapy assessment camp in Borivali West and free online consultations across India, celebrating one year of PhysioSthanak on World Physiotherapy Day.',
};

export default function AnniversaryPage() {
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
            Sep 6 – 14 · One Week Only
          </p>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold uppercase tracking-wide">
            PhysioSthanak Turns One
          </h1>
          <p className="mt-6 text-white/85 max-w-2xl mx-auto text-lg leading-relaxed">
            One year ago, on World Physiotherapy Day, we opened with a simple promise:
            find the root cause, never just mask the symptom. To say thank you, we are
            giving Borivali — and all of India — a week of completely free assessments.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href={waHref} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Book Free Assessment
            </a>
            <a href={phoneHref} className="btn-outline-white">
              Call {siteConfig.phone}
            </a>
          </div>
          <p className="mt-4 text-white/60 text-sm">
            Move . Heal . Improve — since World Physiotherapy Day 2025
          </p>
        </div>
      </section>

      {/* What's on */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-accent uppercase text-center mb-12">
            Anniversary Week — What&rsquo;s On
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

      {/* Why free */}
      <section className="section-padding bg-gray-50">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-accent uppercase mb-6">
            Why a Whole Week Free?
          </h2>
          <p className="text-text-light leading-relaxed mb-4">
            Because assessment-first care is the whole point of this clinic. In one year,
            {' '}{siteConfig.doctorName} — MPTh (Ortho), BPTh, FIFA Diploma in Football
            Medicine, 10+ years and 8000+ cases — has built PhysioSthanak on a habit most
            clinics skip: understanding the whole body before treating any part of it.
          </p>
          <p className="text-text-light leading-relaxed mb-8">
            A proper assessment is the most valuable thing we do, and for one week it is
            our birthday gift to you. Rated 5.0 on Google by the people of Borivali.
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
            Anniversary Week FAQs
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
