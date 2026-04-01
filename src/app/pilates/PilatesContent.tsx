'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { CheckCircle, ChevronDown, Clock, MapPin, Users, Monitor, Building } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { PilatesBatch } from '@/types/pilates';

const WEB3FORMS_KEY = '97e35895-6350-4c20-982e-f2fdb1996900';

const FAQS = [
  {
    question: 'What is Mat Pilates?',
    answer:
      'Mat Pilates is a low-impact, full-body exercise method performed on a mat without machines. It focuses on core strength, flexibility, posture, and controlled breathing. Unlike gym workouts that isolate muscles, Pilates trains your body as a connected system — improving stability, balance, and body awareness. At PhysioSthanak, every session is designed by a physiotherapist to be safe and effective for your specific body.',
  },
  {
    question: 'Who can join these classes?',
    answer:
      'Our Mat Pilates classes are suitable for all fitness levels — from complete beginners to experienced practitioners. Whether you are recovering from an injury, managing chronic pain, looking to improve posture, or simply want a structured fitness routine, our physiotherapist-instructors design exercises around your abilities. People with conditions like back pain, joint stiffness, post-surgery recovery, and even pregnancy can benefit, as every exercise is modified to suit individual needs.',
  },
  {
    question: 'What happens during the free consultation?',
    answer:
      'Before your first class, Dr. Shiva personally conducts a one-on-one clinical biomechanical assessment. This includes evaluating your posture, spinal alignment, joint mobility, muscle strength, flexibility, and any existing injuries or medical conditions. Based on this assessment, she creates a personalized exercise plan that your physiotherapist-instructors follow — so even in a group setting, the movements are tailored to your body. This is what makes our Pilates genuinely different from a generic fitness class.',
  },
  {
    question: "What's the difference between online and offline batches?",
    answer:
      'Offline batches are held at our clinic in Borivali West, Mumbai, where our physiotherapist-instructors personally supervise your form and technique in real time. Online batches are conducted via video call, allowing you to join from anywhere in India. Both formats include the same biomechanical assessment by Dr. Shiva, personalized modifications, and direct guidance from qualified instructors. The online batch is ideal if you live outside Mumbai or prefer the convenience of exercising at home.',
  },
  {
    question: 'What should I wear/bring to class?',
    answer:
      'Wear comfortable, stretchy clothing that allows full range of movement — leggings or track pants and a fitted top work well. Avoid loose or baggy clothes as they make it harder for the instructor to check your form. For offline classes, bring a water bottle and a small towel; mats are provided at the clinic. For online classes, you will need a yoga mat, a stable internet connection, and enough space to stretch your arms and legs freely.',
  },
];

interface PilatesContentProps {
  batches: PilatesBatch[];
}

export default function PilatesContent({ batches }: PilatesContentProps) {
  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      {/* HowTo Schema for AEO — "How to start Pilates" featured snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Start Physiotherapist-Led Mat Pilates at PhysioSthanak',
            description: 'Join Mat Pilates classes led by a qualified physiotherapist in Borivali, Mumbai. Every student gets a free biomechanical assessment before starting.',
            totalTime: 'P7D',
            step: [
              {
                '@type': 'HowToStep',
                name: 'Register Online',
                text: 'Fill out the registration form on our website with your name, phone, email, age, and preferred batch (online or offline). Choose a schedule that fits your routine.',
                url: 'https://physiosthanak.com/pilates#register',
              },
              {
                '@type': 'HowToStep',
                name: 'Free Physiotherapy Consultation',
                text: 'Dr. Shiva Jain Sangoi personally conducts a clinical biomechanical assessment evaluating your posture, joint mobility, muscle imbalances, flexibility, and any existing injuries or medical conditions. She creates your personalized plan.',
              },
              {
                '@type': 'HowToStep',
                name: 'Join Your Customized Batch',
                text: 'Start your Mat Pilates journey led by qualified physiotherapist-instructors who follow Dr. Shiva\u2019s personalized plan for your body. Every session is customized even in a group setting, progressively improving your strength, flexibility, and posture.',
              },
            ],
          }),
        }}
      />

      <HeroSection />
      <WhyDifferentSection />
      <HowItWorksSection />
      <PricingSection />
      <BatchesSection batches={batches} />
      <AboutDrShivaSection />
      <RegistrationFormSection batches={batches} />
      <FAQSectionLocal />
      <CTASectionLocal />
    </>
  );
}

/* ─────────────────────────── 1. HERO ─────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#0e1b2d]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e1b2d]/95 to-[#0e1b2d]/60 z-10" />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 2px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container-max px-4 relative z-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <span className="inline-block bg-accent-pink/20 text-accent-pink border border-accent-pink/30 px-4 py-1.5 rounded-full text-sm font-heading font-medium uppercase tracking-wider">
            NEW — Mat Pilates Classes
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight uppercase">
            Physiotherapist-Led Mat Pilates in Borivali
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Free consultation by Dr. Shiva. Classes by qualified physiotherapist-instructors. Customized to your body.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="#register" className="btn-primary text-center">
              Register Now
            </a>
            <a href="tel:+919324254297" className="btn-outline-white text-center">
              Call Now
            </a>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400 text-lg">
                  ★
                </span>
              ))}
            </div>
            <span className="text-slate-400 text-sm font-medium">
              8000+ Patients Treated by Dr. Shiva &amp; Team
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── 2. WHY DIFFERENT ─────────────────── */

function WhyDifferentSection() {
  const usps = [
    {
      title: 'Every Instructor Is a Physiotherapist',
      description:
        'Unlike most studios where instructors hold a fitness certification, every PhysioSthanak Pilates instructor is a qualified physiotherapist (BPTh). They understand anatomy, biomechanics, and rehabilitation at a clinical level — meaning every exercise is grounded in medical science, not just fitness trends. The entire program is designed and supervised by Dr. Shiva Jain Sangoi, MPTh (Ortho).',
    },
    {
      title: 'Free Biomechanical Assessment by Dr. Shiva',
      description:
        'Every student gets a free one-on-one physiotherapy consultation with Dr. Shiva before their first class. She personally evaluates your posture, joint mobility, muscle imbalances, and injuries. Based on this clinical-grade assessment, your Pilates program is customized — so your instructors know exactly how to modify exercises for your body.',
    },
    {
      title: 'Personalized Group Classes',
      description:
        'Even in a group class, your exercises are customized to YOUR body. Your physiotherapist-instructor knows your assessment results, injuries, and limitations — making it almost a 1-on-1 experience. They modify movements in real time based on Dr. Shiva\u2019s assessment plan, so you get the affordability of a group with the precision of a private physiotherapy session.',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Why We&apos;re Different</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Pilates Led by a Physiotherapist, Not Just an Instructor
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            What makes PhysioSthanak{' '}
            <a href="https://en.wikipedia.org/wiki/Pilates" target="_blank" rel="noopener noreferrer" className="text-accent-pink hover:underline">Pilates</a>{' '}
            genuinely clinical-grade.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {usps.map((usp, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-bold text-accent uppercase mb-3">
                {usp.title}
              </h3>
              <p className="text-text-light leading-relaxed text-sm">{usp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────── 3. HOW IT WORKS ──────────────────── */

function HowItWorksSection() {
  const steps = [
    {
      title: 'Register',
      description:
        'Fill out the registration form below with your details and preferred batch — choose between online or offline classes based on your schedule and location.',
    },
    {
      title: 'Free Consultation with Dr. Shiva',
      description:
        'Dr. Shiva personally conducts a clinical biomechanical assessment — evaluating your posture, flexibility, strength, and any existing conditions. She creates your personalized plan that your instructors follow.',
    },
    {
      title: 'Join Your Batch',
      description:
        'Start your customized Mat Pilates journey led by qualified physiotherapist-instructors. Your exercises are tailored to your body based on Dr. Shiva\u2019s assessment. Every session builds on the last, progressively improving your strength and mobility.',
    },
  ];

  return (
    <section className="section-padding bg-bg-light">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            3 Simple Steps to Start
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-xl mx-auto mb-5">
                {index + 1}
              </div>
              <h3 className="text-lg font-heading font-bold text-accent uppercase mb-3">
                {step.title}
              </h3>
              <p className="text-text-light leading-relaxed text-sm max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── 3B. PRICING ─────────────────── */

function PricingSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Includes free biomechanical assessment by Dr. Shiva before your first class
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Group Batch */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-primary/20 hover:border-accent-pink/40 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-accent-pink text-white text-xs font-heading font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-lg">
              50% Off — First 10 Students
            </div>
            <h3 className="text-lg font-heading font-bold text-accent uppercase mb-2 mt-4">
              Group Batch
            </h3>
            <p className="text-text-light text-sm mb-4">8 sessions over 4 weeks — twice a week</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-heading font-bold text-accent">₹3,000</span>
              <span className="text-lg text-text-light line-through">₹6,000</span>
            </div>
            <p className="text-xs text-accent-pink font-medium mb-6">
              50% off launch offer for first 10 registrations
            </p>
            <ul className="space-y-2 mb-6 text-sm text-text-light">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Free biomechanical assessment by Dr. Shiva
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                All instructors are qualified physiotherapists
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Exercises customized to your body
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Online (Google Meet) or Offline (at clinic)
              </li>
            </ul>
            <a href="#register" className="btn-primary text-center text-sm w-full block">
              Register Now
            </a>
          </div>

          {/* 1:1 Batch */}
          <div className="bg-white rounded-lg p-8 shadow-lg border border-slate-100 hover:border-primary/20 transition-all">
            <h3 className="text-lg font-heading font-bold text-accent uppercase mb-2 mt-4">
              1:1 Private Session
            </h3>
            <p className="text-text-light text-sm mb-4">8 sessions over 4 weeks — twice a week</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-heading font-bold text-accent">₹10,000</span>
            </div>
            <p className="text-xs text-text-light mb-6">
              Personalized one-on-one with your physiotherapist-instructor
            </p>
            <ul className="space-y-2 mb-6 text-sm text-text-light">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Free biomechanical assessment by Dr. Shiva
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Fully personalized program
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Flexible scheduling
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Ideal for rehab or specific conditions
              </li>
            </ul>
            <a href="#register" className="btn-outline text-center text-sm w-full block">
              Register for 1:1
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-text-light mt-8 max-w-lg mx-auto space-y-1">
          <p>Payment is collected during your first consultation call. No refunds after enrollment.</p>
          <p>Missed sessions are not repeated or refunded. No recordings of sessions permitted.</p>
          <p>See our <a href="/terms" className="text-accent-pink hover:underline">Terms of Service</a> for full details.</p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── 4. AVAILABLE BATCHES ─────────────────── */

function BatchesSection({ batches }: { batches: PilatesBatch[] }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Batches</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Available Mat Pilates Batches
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Choose a batch that fits your schedule. All batches include the free biomechanical
            assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {batches.map((batch) => {
            const spotsRemaining = batch.capacity - batch.current_count;
            const isFull = spotsRemaining <= 0;
            const mode = batch.type === 'online' ? 'Online' : 'Offline';

            return (
              <div
                key={batch.id}
                className={`bg-white rounded-lg p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border flex flex-col ${
                  isFull
                    ? 'border-slate-200 opacity-75'
                    : 'border-slate-100 hover:border-primary/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-bold text-accent uppercase">
                    {batch.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider ${
                      mode === 'Online'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {mode === 'Online' ? (
                      <Monitor className="w-3 h-3" />
                    ) : (
                      <Building className="w-3 h-3" />
                    )}
                    {mode}
                  </span>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 text-text-light text-sm">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{batch.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-light text-sm">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{batch.days}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-light text-sm">
                    <Users className="w-4 h-4 text-primary flex-shrink-0" />
                    {isFull ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                        Batch Full
                      </span>
                    ) : (
                      <span>{spotsRemaining} {spotsRemaining === 1 ? 'spot' : 'spots'} remaining</span>
                    )}
                  </div>
                </div>

                {isFull ? (
                  <span className="btn-primary text-center text-sm w-full opacity-50 cursor-not-allowed pointer-events-none">
                    Batch Full
                  </span>
                ) : (
                  <a href="#register" className="btn-primary text-center text-sm w-full">
                    Register
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── 5. ABOUT DR. SHIVA ──────────────── */

function AboutDrShivaSection() {
  const points = [
    {
      title: 'Program Designed by Dr. Shiva (MPTh Ortho)',
      description:
        'Dr. Shiva Jain Sangoi personally designs every student\u2019s Pilates program based on her clinical biomechanical assessment. With an MPTh in Orthopedics, she brings deep expertise in musculoskeletal conditions, posture correction, and movement science to the program design.',
    },
    {
      title: 'Classes Led by Physiotherapist-Instructors',
      description:
        'Your daily classes are conducted by qualified physiotherapists (BPTh) who are also certified Pilates instructors. They follow Dr. Shiva\u2019s personalized plan for each student, modifying exercises in real time based on your clinical assessment results.',
    },
    {
      title: 'A Team That Understands Your Body Clinically',
      description:
        'With 9+ years of clinical experience and 8000+ cases across the team, every instructor understands how different bodies move, compensate, and recover. This clinical depth makes PhysioSthanak Pilates genuinely different from fitness-only studios.',
    },
  ];

  return (
    <section className="section-padding bg-bg-light">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <div>
            <span className="section-eyebrow">Your Team</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
              Designed by Dr. Shiva, Delivered by Expert Physiotherapist-Instructors
            </h2>
            <p className="text-lg text-text-light mb-8">
              Every instructor at PhysioSthanak is a qualified physiotherapist (BPTh) and certified Pilates instructor, trained and supervised by Dr. Shiva Jain Sangoi (MPTh Ortho, FIFA Diploma)
            </p>

            <div className="space-y-6">
              {points.map((point, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-accent mb-2 uppercase">
                      {point.title}
                    </h3>
                    <p className="text-text-light leading-relaxed text-sm">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[250px] sm:h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-xl bg-bg-lighter">
            <Image
              src="/images/about/dr-shiva-jain.png"
              alt="Dr. Shiva Jain Sangoi — Mat Pilates instructor and physiotherapist in Borivali"
              fill
              className="object-contain object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── 6. REGISTRATION FORM ─────────────── */

function RegistrationFormSection({ batches }: { batches: PilatesBatch[] }) {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorDetail, setErrorDetail] = useState<string>('');
  const [registrationStatus, setRegistrationStatus] = useState<'registered' | 'waitlisted' | null>(null);
  const [preference, setPreference] = useState<'Offline' | 'Online'>('Offline');
  const [batchType, setBatchType] = useState<'group' | '1:1' | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    batch: '',
    medicalHistory: '',
  });

  const filteredBatches = batchType === 'group' ? batches.filter((b) => b.type === preference.toLowerCase()) : [];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate session type
    if (!batchType) {
      setErrorDetail('Please select a session type (Group or 1:1)');
      setFormState('error');
      return;
    }

    // Validate batch selection for group
    if (batchType === 'group' && !formData.batch) {
      setErrorDetail('Please select a batch time slot');
      setFormState('error');
      return;
    }

    setFormState('submitting');

    try {
      const selectedBatch = batches.find((b) => b.id === formData.batch);
      const mode = selectedBatch ? (selectedBatch.type === 'online' ? 'Online' : 'Offline') : preference;

      // 1. Save to Supabase
      const supabase = createClient();
      const { data: registration, error: supabaseError } = await supabase
        .from('pilates_registrations')
        .insert({
          batch_id: batchType === 'group' ? (formData.batch || null) : null,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          age: parseInt(formData.age, 10),
          preference: preference.toLowerCase(),
          batch_type: batchType,
          medical_history: formData.medicalHistory || null,
        })
        .select('status')
        .single();

      if (supabaseError) {
        console.error('Supabase registration error:', supabaseError);
        setErrorDetail(`Supabase: ${supabaseError.message} (code: ${supabaseError.code})`);
        setFormState('error');
        return;
      }

      // Track whether registered or waitlisted
      setRegistrationStatus(registration?.status === 'waitlisted' ? 'waitlisted' : 'registered');

      // 2. Send to Web3Forms for email notification (parallel, non-blocking)
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          age: formData.age,
          preference: preference,
          batch_type: batchType === '1:1' ? '1:1 Private Session' : 'Group Batch',
          batch: batchType === '1:1' ? 'N/A (1:1 — schedule during consultation)' : (selectedBatch ? `${selectedBatch.name} (${mode}) — ${selectedBatch.days}, ${selectedBatch.time}` : 'Not selected'),
          medical_history: formData.medicalHistory || 'None provided',
          status: registration?.status || 'registered',
          source_page: 'Pilates Landing Page',
          subject: `New Mat Pilates Registration — ${formData.name}${registration?.status === 'waitlisted' ? ' (WAITLISTED)' : ''}`,
          from_name: 'PhysioSthanak Website',
          botcheck: '',
        }),
      }).catch(() => {
        // Web3Forms is a backup — don't fail the registration if it errors
      });

      setFormState('success');
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setFormState('error');
    }
  }

  // Reset batch selection when preference changes
  function handlePreferenceChange(newPref: 'Offline' | 'Online') {
    setPreference(newPref);
    setFormData((prev) => ({ ...prev, batch: '' }));
  }

  const inputClass =
    'w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm';

  return (
    <section id="register" className="section-padding bg-white">
      <div className="container-max max-w-2xl">
        <div className="text-center mb-10">
          <span className="section-eyebrow">Register</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Register for Mat Pilates
          </h2>
          <p className="text-lg text-text-light max-w-xl mx-auto">
            Fill out the form below and we&apos;ll call you to schedule your free physiotherapy
            consultation.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 md:p-10 border-t-4 border-t-accent-pink">
          {formState === 'success' ? (
            <div className="text-center py-8">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                registrationStatus === 'waitlisted' ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <svg
                  className={`w-8 h-8 ${registrationStatus === 'waitlisted' ? 'text-yellow-600' : 'text-green-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={registrationStatus === 'waitlisted' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' : 'M5 13l4 4L19 7'}
                  />
                </svg>
              </div>
              {registrationStatus === 'waitlisted' ? (
                <>
                  <p className="text-lg font-heading font-bold text-accent mb-2">
                    You&apos;re on the Waitlist!
                  </p>
                  <p className="text-text-light text-sm max-w-md mx-auto">
                    This batch is currently full, but we&apos;ve added you to the waitlist.
                    We&apos;ll call you as soon as a spot opens up, or suggest an alternative batch.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-heading font-bold text-accent mb-2">
                    Registration Received!
                  </p>
                  <p className="text-text-light text-sm max-w-md mx-auto">
                    Thanks for registering! You&apos;ll receive a call from Dr. Shiva&apos;s team to
                    schedule your free physiotherapy consultation.
                  </p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot */}
              <input
                type="text"
                name="botcheck"
                className="hidden"
                style={{ display: 'none' }}
              />

              {/* Name */}
              <div>
                <label
                  htmlFor="pilates-name"
                  className="block text-sm font-heading font-bold text-accent mb-1.5 uppercase tracking-wide"
                >
                  Name <span className="text-accent-pink">*</span>
                </label>
                <input
                  id="pilates-name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="pilates-phone"
                  className="block text-sm font-heading font-bold text-accent mb-1.5 uppercase tracking-wide"
                >
                  Phone <span className="text-accent-pink">*</span>
                </label>
                <input
                  id="pilates-phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="pilates-email"
                  className="block text-sm font-heading font-bold text-accent mb-1.5 uppercase tracking-wide"
                >
                  Email <span className="text-accent-pink">*</span>
                </label>
                <input
                  id="pilates-email"
                  type="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="pilates-age"
                  className="block text-sm font-heading font-bold text-accent mb-1.5 uppercase tracking-wide"
                >
                  Age <span className="text-accent-pink">*</span>
                </label>
                <input
                  id="pilates-age"
                  type="number"
                  placeholder="Your age"
                  min="5"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>

              {/* Batch Type — Group / 1:1 */}
              <div>
                <label className="block text-sm font-heading font-bold text-accent mb-2 uppercase tracking-wide">
                  Session Type <span className="text-accent-pink">*</span>
                </label>
                <div className="flex gap-4">
                  {([{ value: 'group' as const, label: 'Group (₹3,000)', sub: '50% off launch' }, { value: '1:1' as const, label: '1:1 Private (₹10,000)', sub: '' }]).map((option) => (
                    <label
                      key={option.value}
                      className={`flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-md border-2 cursor-pointer transition-all text-sm font-heading font-bold uppercase tracking-wide ${
                        batchType === option.value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-primary/20 text-text-light hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="batchType"
                        value={option.value}
                        checked={batchType === option.value}
                        onChange={() => {
                          setBatchType(option.value);
                          if (option.value === '1:1') {
                            setFormData({ ...formData, batch: '' });
                          }
                        }}
                        className="sr-only"
                      />
                      <span>{option.label}</span>
                      {option.sub && <span className="text-xs text-accent-pink font-normal normal-case mt-0.5">{option.sub}</span>}
                    </label>
                  ))}
                </div>
              </div>

              {/* Preference — Online / Offline + Batch selector (only for group) */}
              {batchType === 'group' && (<>
              <div>
                <label className="block text-sm font-heading font-bold text-accent mb-2 uppercase tracking-wide">
                  Mode <span className="text-accent-pink">*</span>
                </label>
                <div className="flex gap-4">
                  {(['Offline', 'Online'] as const).map((option) => (
                    <label
                      key={option}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md border-2 cursor-pointer transition-all text-sm font-heading font-bold uppercase tracking-wide ${
                        preference === option
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-primary/20 text-text-light hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preference"
                        value={option}
                        checked={preference === option}
                        onChange={() => handlePreferenceChange(option)}
                        className="sr-only"
                      />
                      {option === 'Offline' ? (
                        <Building className="w-4 h-4" />
                      ) : (
                        <Monitor className="w-4 h-4" />
                      )}
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* Batch selection — grouped time slot cards */}
              <div>
                <label className="block text-sm font-heading font-bold text-accent mb-3 uppercase tracking-wide">
                  Select Your Batch <span className="text-accent-pink">*</span>
                </label>

                {/* Group batches by days */}
                {(() => {
                  const dayGroups = [...new Set(filteredBatches.map((b) => b.days))];
                  return dayGroups.map((dayGroup) => {
                    const dayBatches = filteredBatches
                      .filter((b) => b.days === dayGroup)
                      .sort((a, b) => {
                        // Parse hour from "8:00 AM" or "10:00 AM" format
                        const hourA = parseInt(a.time.split(':')[0]);
                        const hourB = parseInt(b.time.split(':')[0]);
                        return hourA - hourB;
                      });
                    if (dayBatches.length === 0) return null;

                    return (
                      <div key={dayGroup} className="mb-4">
                        <p className="text-xs font-heading font-bold text-text-light uppercase tracking-widest mb-2">
                          {dayGroup}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {dayBatches.map((batch) => {
                            const spotsRemaining = batch.capacity - batch.current_count;
                            const isFull = spotsRemaining <= 0;

                            return (
                              <button
                                key={batch.id}
                                type="button"
                                disabled={isFull}
                                onClick={() => setFormData({ ...formData, batch: batch.id })}
                                className={`px-4 py-2.5 rounded-md border-2 text-sm font-heading font-bold transition-all ${
                                  isFull
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50 line-through'
                                    : formData.batch === batch.id
                                      ? 'border-accent-pink bg-accent-pink/10 text-accent-pink shadow-sm'
                                      : 'border-primary/15 text-text-light hover:border-primary/30 hover:bg-primary/5'
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                                {batch.time}
                                {isFull && <span className="ml-1.5 text-xs no-underline">(Full)</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Hidden required input for form validation */}
                <input
                  type="text"
                  value={formData.batch}
                  required
                  className="sr-only"
                  tabIndex={-1}
                  onChange={() => {}}
                  aria-hidden="true"
                />
              </div>
              </>)}

              {/* 1:1 info message */}
              {batchType === '1:1' && (
                <div className="bg-primary/5 border border-primary/20 rounded-md p-4 text-sm text-text-light">
                  <p className="font-heading font-bold text-accent mb-1 uppercase text-xs tracking-wide">1:1 Private Sessions</p>
                  <p>Schedule and timing will be discussed during your free consultation with Dr. Shiva. Flexible slots available based on your preference.</p>
                </div>
              )}

              {/* Medical History */}
              <div>
                <label
                  htmlFor="pilates-medical"
                  className="block text-sm font-heading font-bold text-accent mb-1.5 uppercase tracking-wide"
                >
                  Medical History{' '}
                  <span className="text-text-light font-normal normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="pilates-medical"
                  placeholder="Any injuries, surgeries, chronic conditions, or medications we should know about"
                  rows={3}
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formState === 'submitting' ? 'Submitting...' : 'Register for Mat Pilates'}
              </button>

              {formState === 'error' && (
                <div className="text-red-500 text-sm text-center space-y-1">
                  <p>Something went wrong. Please try again or call us at +91 9324254297.</p>
                  {errorDetail && (
                    <p className="text-xs text-red-400 bg-red-50 p-2 rounded font-mono break-all">
                      Debug: {errorDetail}
                    </p>
                  )}
                </div>
              )}
            </form>
          )}

          <p className="text-xs text-text-light text-center mt-4">
            We&apos;ll respond within 24 hours to schedule your free consultation.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── 7. FAQ ────────────────────── */

function FAQSectionLocal() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-bg-light">
      <div className="container-max max-w-4xl">
        <div className="text-center mb-14">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Frequently Asked Questions About Mat Pilates
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="border border-border-light rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left font-heading font-bold text-accent hover:bg-bg-light transition-colors flex items-center justify-between"
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-bg-light border-t border-border-light">
                  <p className="text-text-light leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── 8. CTA ────────────────────── */

function CTASectionLocal() {
  return (
    <section className="section-padding-lg bg-[#0e1b2d] text-white relative overflow-hidden">
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.15) 2px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container-max text-center relative z-10">
        <span className="section-eyebrow">Start Today</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6 uppercase text-white">
          Start Your Pilates Journey Today
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
          Register now and get a free physiotherapy consultation with Dr. Shiva and team before your first
          class. Limited spots available in each batch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#register" className="btn-primary text-center">
            Register Now
          </a>
          <a href="tel:+919324254297" className="btn-outline-white text-center">
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
