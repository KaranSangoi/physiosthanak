import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'PhysioSthanak Turns 2 — Free Assessment Month | September',
  description:
    'PhysioSthanak was born on World Physiotherapy Day. To celebrate turning two, book a free full-body assessment at our Borivali West clinic any time in September — by appointment.',
  alternates: {
    canonical: `${siteConfig.domain}/physiotherapy-day`,
  },
  openGraph: {
    title: 'PhysioSthanak Turns 2 — Free Assessment Month',
    description:
      'Born on World Physiotherapy Day 2024. Celebrate with us: free full-body assessments all September at Borivali West, by appointment. Camp day Sep 8.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/physiotherapy-day`,
    siteName: siteConfig.businessName,
  },
};

const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, '')}`;
const waHref = `https://wa.me/${siteConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
  'Hi Dr. Shiva, I would like to book my free anniversary-month assessment.',
)}`;

const events = [
  {
    dates: 'All September',
    title: 'Free Full-Body Assessment — By Appointment',
    text: 'Book a slot any day this month. Dr. Shiva Jain Sangoi personally assesses how you stand, sit, bend and move — the complete root-cause evaluation — free. Every slot is confirmed personally by Dr. Shiva, so booking ahead is essential.',
  },
  {
    dates: 'Sep 8 · World Physiotherapy Day',
    title: 'Birthday Camp Day',
    text: 'PhysioSthanak was born on World Physiotherapy Day — this is our actual birthday. Special camp hours with back-to-back assessments and posture screenings. Slots are limited and go fastest on this day; book early.',
  },
  {
    dates: 'Anytime',
    title: 'Bring Someone You Worry About',
    text: 'A parent whose knees complain on stairs. A colleague living with neck stiffness. Anyone whose ache has quietly become routine. One careful assessment often explains years of discomfort — this month, it costs nothing to find out.',
  },
];

const faqs = [
  {
    q: 'Is the assessment really free? What is the catch?',
    a: 'No catch. The first consultation at our clinic has always been free — our anniversary month simply celebrates it louder. If you need treatment, Dr. Shiva will say so honestly, with a clear plan. If you are doing fine, she will happily tell you that too.',
  },
  {
    q: 'How do I book? Can I just walk in?',
    a: 'Booking is by appointment — every slot is personally confirmed by Dr. Shiva. Call or WhatsApp us on +91 93242 54297. Slots are limited each day, and camp day (Sep 8) fills fastest.',
  },
  {
    q: 'Who should come for an assessment?',
    a: 'Anyone with back pain, neck pain, knee pain, an old injury that never fully settled, post-surgery stiffness, or a daily ache that has become part of the routine. Seniors and desk workers especially — one assessment often explains years of discomfort.',
  },
  {
    q: 'I am not in Mumbai — can I consult online?',
    a: 'Yes — online video consultations with Dr. Shiva are available as a regular paid service, booked after payment and confirmation. The free assessment month applies to in-clinic visits at Borivali West.',
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
  name: 'PhysioSthanak Turns 2 — Free Assessment Month',
  startDate: '2026-09-01',
  endDate: '2026-09-30',
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
    'PhysioSthanak celebrates its second anniversary with free full-body physiotherapy assessments all September at Borivali West, by appointment. Birthday camp day on World Physiotherapy Day, September 8.',
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
            All September · Free Assessment Month
          </p>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold uppercase tracking-wide">
            PhysioSthanak Turns Two
          </h1>
          <p className="mt-6 text-white/85 max-w-2xl mx-auto text-lg leading-relaxed">
            Two years ago, on World Physiotherapy Day 2024, PhysioSthanak was born with
            one promise: find the root cause, never just mask the symptom. To celebrate
            our birthday, full-body assessments are free all September — by appointment
            at our Borivali West clinic.
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
            Move . Heal . Improve — born on World Physiotherapy Day
          </p>
        </div>
      </section>

      {/* What's on */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-accent uppercase text-center mb-12">
            Anniversary Month — What&rsquo;s On
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

      {/* The story */}
      <section className="section-padding bg-gray-50">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-accent uppercase mb-6">
            Born on Physiotherapy&rsquo;s Own Day
          </h2>
          <p className="text-text-light leading-relaxed mb-4">
            It started on September 8, 2024 — World Physiotherapy Day — when
            {' '}{siteConfig.doctorName} put a name to a conviction built over 10+ years
            and 8000+ cases: that most pain is treated at the symptom when it should be
            traced to its source. A year later, the PhysioSthanak clinic opened its doors
            in Borivali West. Today it is rated 5.0 on Google by the people it serves.
          </p>
          <p className="text-text-light leading-relaxed mb-8">
            A proper assessment is the most valuable thing we do — and every September,
            on the month of our birthday, it is our gift to the neighbourhood.
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
            Anniversary Month FAQs
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
