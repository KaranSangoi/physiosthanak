'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { CheckCircle, ChevronDown, Clock, MapPin, Users, Monitor, Building } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { PilatesBatch } from '@/types/pilates';

const WEB3FORMS_KEY = '97e35895-6350-4c20-982e-f2fdb1996900';

const FAQS = [
  {
    question: 'What is Mat Pilates, and why does it need no machines?',
    answer:
      'Mat Pilates is a low-impact, full-body exercise method performed on a simple mat — no reformers, no springs, no bulky equipment. Your own body weight, controlled breathing, and precise movement do all the work. That is exactly what makes it perfect for online classes: you get the full benefit at home with nothing more than a yoga mat and a little floor space. It builds core strength, flexibility, posture, and body awareness — training your body as a connected system rather than isolated muscles. At PhysioSthanak, every session is designed by physiotherapists to be safe and effective for your specific body.',
  },
  {
    question: 'Who benefits most from these classes?',
    answer:
      'Our online Mat Pilates classes are exclusively for women of all fitness levels — and because every exercise is physiotherapist-designed and modified, they are safe even for those who have never exercised before. The women who benefit most: new mothers rebuilding core strength after delivery (including diastasis recti recovery), homemakers with back or neck pain from daily household strain, working women with desk-related posture problems, women managing joint stiffness or early arthritis, and seniors who want to stay strong and mobile safely. If you can lie down on a mat, there is a version of every exercise for you.',
  },
  {
    question: 'What happens during the free assessment?',
    answer:
      'Before your first class, Dr. Shiva and/or her team of qualified physiotherapists conduct a one-on-one clinical biomechanical assessment — evaluating your posture, spinal alignment, joint mobility, muscle strength, flexibility, and any existing injuries or medical conditions. Based on this, your personalized exercise plan is created and your goals for the 4 weeks are set — so even in a group class, every movement is tailored to your body. And at the end of your 4-week program, you receive a complimentary re-assessment to measure exactly how far you have come. Both assessments are included free with every package.',
  },
  {
    question: 'How is physiotherapist-led Pilates different from a regular fitness class?',
    answer:
      'Three things a fitness-only class cannot give you: a clinical assessment before you start (so exercises are chosen for your body, not a generic routine), medically-informed modifications during class (your instructor knows your injuries, conditions, and assessment results), and measurable goal-setting with a before-and-after comparison. Fitness instructors count reps; physiotherapists watch how your body moves and correct the pattern, not just the posture. That is why our classes are safe for post-partum recovery, back pain, and seniors — situations where a generic class could do more harm than good.',
  },
  {
    question: 'What do I need for the online classes?',
    answer:
      'Just three things: a yoga mat, a stable internet connection, and enough floor space to stretch your arms and legs freely. Wear comfortable, stretchy clothing — leggings or track pants and a fitted top work well, as loose clothes make it harder for your instructor to check your form on screen. Classes are held live on video with a maximum of 4 women per batch, so your instructor can actually see and correct every participant — this is not a pre-recorded video you follow alone.',
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
            name: 'How to Start Women-Only Physiotherapist-Led Online Mat Pilates at PhysioSthanak',
            description: 'Join women-only online Mat Pilates classes led by qualified physiotherapists. Every student gets a free biomechanical assessment before starting and a complimentary re-assessment after 4 weeks.',
            totalTime: 'P7D',
            step: [
              {
                '@type': 'HowToStep',
                name: 'Register Online',
                text: 'Fill out the registration form on our website with your name, phone, email, age, and preferred batch timing (Mon/Wed/Fri \u2014 8, 9, or 10 AM). Only 4 seats per batch.',
                url: 'https://physiosthanak.com/pilates#register',
              },
              {
                '@type': 'HowToStep',
                name: 'Free Physiotherapy Assessment & Goal Setting',
                text: 'Dr. Shiva Jain Sangoi and/or her team of qualified physiotherapists conduct a clinical biomechanical assessment evaluating your posture, joint mobility, muscle imbalances, flexibility, and any existing injuries or medical conditions \u2014 then set your personal 4-week goals.',
              },
              {
                '@type': 'HowToStep',
                name: 'Join Your Customized Online Batch',
                text: 'Start your 12-session, 4-week Mat Pilates journey (Mon/Wed/Fri) led live on video by qualified physiotherapist-instructors who follow your personalized plan. Maximum 4 women per batch, so every movement is watched and corrected.',
              },
              {
                '@type': 'HowToStep',
                name: 'Complimentary 4-Week Re-assessment',
                text: 'At the end of your program, receive a free follow-up biomechanical assessment comparing your strength, flexibility, and posture against your starting point \u2014 so your progress is measured, not guessed.',
              },
            ],
          }),
        }}
      />

      <HeroSection />
      <WhyDifferentSection />
      <BenefitsSection />
      <ImageStripSection />
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
      {/* Background image */}
      <Image
        src="/images/pilates/hero-bg.jpg"
        alt=""
        fill
        className="object-cover object-center z-0"
        priority
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e1b2d]/90 to-[#0e1b2d]/70 z-10" />

      <div className="container-max px-4 relative z-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <span className="inline-block bg-accent-pink/20 text-accent-pink border border-accent-pink/30 px-4 py-1.5 rounded-full text-sm font-heading font-medium uppercase tracking-wider">
            Women-Only Mat Pilates Classes
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight uppercase">
            Physiotherapist-Led Online Mat Pilates for Women
          </h1>

          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Live online women-only classes, max 4 per batch, led by qualified physiotherapist-instructors.
            Free assessment by Dr. Shiva &amp; her team — before AND after your 4-week program.
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
              8000+ Women &amp; Patients Treated by Dr. Shiva &amp; Team
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
      title: 'Free Assessment Before AND After — With Goal Setting',
      description:
        'Every student gets a free one-on-one biomechanical assessment by Dr. Shiva and/or her team of qualified physiotherapists before the first class — posture, joint mobility, muscle imbalances, injuries — and your personal 4-week goals are set from it. Then, when your program ends, a complimentary re-assessment measures your progress against those goals. You see the change in numbers, not just feelings. Both assessments are included in every package at no extra cost.',
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-10 items-center">
          {/* USP cards */}
          <div className="lg:col-span-3 grid grid-cols-1 gap-5">
            {usps.map((usp, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20 flex gap-5"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-accent uppercase mb-2">
                    {usp.title}
                  </h3>
                  <p className="text-text-light leading-relaxed text-sm">{usp.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Side image */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/pilates/pilates-stretch.jpg"
                alt="Woman performing a pilates lunge stretch on a mat"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1b2d]/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── 2B. WHO BENEFITS / WHY MAT ─────────────── */

function BenefitsSection() {
  const audiences = [
    {
      title: 'New Mothers & Postpartum Recovery',
      description:
        'Gently rebuild core and pelvic floor strength after delivery — including structured recovery for diastasis recti (abdominal separation). Every exercise is physiotherapist-screened for postpartum safety, something a generic fitness class cannot promise.',
    },
    {
      title: 'Homemakers with Back & Neck Strain',
      description:
        'Years of lifting, bending, and standing in the kitchen quietly load the spine. Mat Pilates strengthens the deep muscles that protect your back — so daily work stops hurting, and energy lasts longer through the day.',
    },
    {
      title: 'Working Women & Desk Professionals',
      description:
        'Rounded shoulders, stiff neck, lower-back ache from long sitting hours — Pilates directly targets the postural muscles that desk life switches off. Just three mornings a week, from home, before work begins.',
    },
    {
      title: 'Seniors & First-Time Exercisers',
      description:
        'Because Mat Pilates is low-impact and needs no equipment, it is one of the safest ways for older women to build strength, balance, and bone-loading — reducing fall risk and joint stiffness. Every movement has a gentler version, and your instructor knows exactly when to use it.',
    },
  ];

  const matPoints = [
    'No reformers, springs, or bulky machines — just a mat and your own body',
    'Full clinical benefit at home: perfect for live online classes',
    'Low-impact and joint-friendly — safe for every age and fitness level',
    'Physiotherapist-set goals with a measured before-and-after comparison',
  ];

  return (
    <section className="section-padding bg-bg-light">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Who Is This For?</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Made for Real Women, Real Bodies, Real Routines
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Mat Pilates needs no machines and no gym — which is exactly why it works for the women
            who need it most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {audiences.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-lg border border-slate-100 hover:border-accent-pink/30 hover:shadow-xl transition-all"
            >
              <h3 className="text-base font-heading font-bold text-accent uppercase mb-2">
                {item.title}
              </h3>
              <p className="text-text-light leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/15 rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
          <h3 className="text-lg font-heading font-bold text-accent uppercase mb-4 text-center">
            Why Mat Pilates — and Why Online Works So Well
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {matPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-light">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── IMAGE STRIP ─────────────── */

function ImageStripSection() {
  return (
    <section className="py-2 bg-white">
      <div className="container-max">
        <div className="grid grid-cols-3 gap-2 md:gap-4 rounded-xl overflow-hidden">
          <div className="relative h-[150px] sm:h-[200px] md:h-[250px]">
            <Image
              src="/images/pilates/pilates-core.jpg"
              alt="Woman doing core exercises on a pilates mat"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="relative h-[150px] sm:h-[200px] md:h-[250px]">
            <Image
              src="/images/pilates/pilates-mat.jpg"
              alt="Woman in child's pose on a pink pilates mat"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
          <div className="relative h-[150px] sm:h-[200px] md:h-[250px]">
            <Image
              src="/images/pilates/pilates-plank.jpg"
              alt="Woman stretching on a pilates mat"
              fill
              className="object-cover"
              sizes="33vw"
            />
          </div>
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
        'Fill out the registration form below and pick your batch timing — Monday/Wednesday/Friday, at 8, 9, or 10 AM. Only 4 seats per batch, so every student gets real attention.',
    },
    {
      title: 'Free Assessment & Goal Setting',
      description:
        'Dr. Shiva and/or her team of qualified physiotherapists conduct your clinical biomechanical assessment — posture, flexibility, strength, existing conditions — and set your personal 4-week goals. Your instructors follow this plan in every class.',
    },
    {
      title: 'Train 3x a Week for 4 Weeks',
      description:
        'Twelve live online sessions (Mon/Wed/Fri) with your physiotherapist-instructor. Exercises are tailored to your assessment, corrected live on video, and progressed week by week as your strength and control improve.',
    },
    {
      title: 'Complimentary Progress Re-assessment',
      description:
        'After your 4 weeks, a free follow-up assessment measures your progress against your starting point \u2014 strength, flexibility, posture. You see exactly what changed, and what your next goal should be.',
    },
  ];

  return (
    <section className="section-padding bg-bg-light">
      <div className="container-max">
        <div className="text-center mb-14">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Your 4-Week Journey, Step by Step
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
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
            Every package includes a free biomechanical assessment with goal setting before your
            first class — and a complimentary progress re-assessment after your 4 weeks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Group Batch */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-primary/20 hover:border-accent-pink/40 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-accent-pink text-white text-xs font-heading font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-lg">
              Founding Batch Price
            </div>
            <h3 className="text-lg font-heading font-bold text-accent uppercase mb-2 mt-4">
              Group Batch — Only 4 Seats
            </h3>
            <p className="text-text-light text-sm mb-4">
              12 live online sessions over 4 weeks — Mon/Wed/Fri
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-heading font-bold text-accent">₹5,000</span>
              <span className="text-lg text-text-light line-through">₹8,000</span>
            </div>
            <p className="text-xs text-accent-pink font-medium mb-6">
              Founding-batch price — locked in for as long as you continue, till seats last
            </p>
            <ul className="space-y-2 mb-6 text-sm text-text-light">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Free pre &amp; post assessment by Dr. Shiva and/or her team
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Personal 4-week goals, measured at the end
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Max 4 women per batch — every rep is watched &amp; corrected
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                All instructors are qualified physiotherapists
              </li>
            </ul>
            <a href="#register" className="btn-primary text-center text-sm w-full block">
              Reserve Your Seat
            </a>
          </div>

          {/* 1:1 Batch */}
          <div className="bg-white rounded-lg p-8 shadow-lg border border-slate-100 hover:border-primary/20 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-heading font-bold uppercase tracking-wider px-4 py-1.5 rounded-bl-lg">
              Launch Offer
            </div>
            <h3 className="text-lg font-heading font-bold text-accent uppercase mb-2 mt-4">
              1:1 Private Sessions
            </h3>
            <p className="text-text-light text-sm mb-4">
              12 live online sessions over 4 weeks — flexible scheduling
            </p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-heading font-bold text-accent">₹10,000</span>
              <span className="text-lg text-text-light line-through">₹12,000</span>
            </div>
            <p className="text-xs text-accent-pink font-medium mb-6">
              Introductory launch price — limited 1:1 slots per week
            </p>
            <ul className="space-y-2 mb-6 text-sm text-text-light">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Free pre &amp; post assessment by Dr. Shiva and/or her team
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Fully personalized program, one-on-one attention
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Flexible timing around your routine
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Ideal for rehab, postpartum, or specific conditions
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
            Available Online Batches — Mon · Wed · Fri
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Three morning slots, live on video, only 4 seats each. All batches include the free
            pre &amp; post assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {batches.filter((b) => b.type === 'online').map((batch) => {
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
                      <span>{spotsRemaining} of 4 {spotsRemaining === 1 ? 'seat' : 'seats'} remaining</span>
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
        'With 10+ years of clinical experience and 8000+ cases across the team, every instructor understands how different bodies move, compensate, and recover. This clinical depth makes PhysioSthanak Pilates genuinely different from fitness-only studios.',
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
  // Classes are online-only — mode selection removed (Aug 2026)
  const preference = 'Online' as const;
  const [batchType, setBatchType] = useState<'group' | '1:1' | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    batch: '',
    medicalHistory: '',
  });

  const filteredBatches = batchType === 'group' ? batches.filter((b) => b.type === 'online') : [];

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
          batch_id: batchType === 'group' ? formData.batch : null,
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
          cc: formData.email,
          replyto: formData.email,
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
          subject: `Mat Pilates Registration Confirmed — ${formData.name}`,
          from_name: 'PhysioSthanak',
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

  const inputClass =
    'w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm';

  return (
    <section id="register" className="section-padding bg-white">
      <div className="container-max max-w-2xl">
        <div className="text-center mb-10">
          <span className="section-eyebrow">Register</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            Register for Women-Only Mat Pilates
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
                  {([{ value: 'group' as const, label: 'Group (₹5,000)', sub: 'founding price · 4 seats/batch' }, { value: '1:1' as const, label: '1:1 Private (₹10,000)', sub: 'launch offer · was ₹12,000' }]).map((option) => (
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

              {/* Batch selector (only for group) — classes are online-only */}
              {batchType === 'group' && (<>
              <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2.5 flex items-center gap-2 text-sm text-blue-800">
                <Monitor className="w-4 h-4 flex-shrink-0" />
                All classes are live online — join from anywhere in India.
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
      {/* Background image */}
      <Image
        src="/images/pilates/cta-bg.jpg"
        alt=""
        fill
        className="object-cover object-center z-0"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0e1b2d]/80 z-[1]" />

      <div className="container-max text-center relative z-10">
        <span className="section-eyebrow">Start Today</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6 uppercase text-white">
          Start Your Pilates Journey Today
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
          Register now for live online women-only batches — free assessment by Dr. Shiva &amp; her
          team before you start, complimentary re-assessment after 4 weeks. Only 4 seats per batch.
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
