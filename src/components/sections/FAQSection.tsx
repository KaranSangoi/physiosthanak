'use client';

import { useState } from 'react';
import { FAQ } from '@/types';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
  heading: string;
  subheading?: string;
  faqs: FAQ[];
}

export default function FAQSection({
  heading,
  subheading,
  faqs,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
              {heading}
            </h2>
            {subheading && (
              <p className="text-lg text-text-light">
                {subheading}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-border-light rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-6 py-4 text-left font-semibold text-accent hover:bg-bg-light transition-colors flex items-center justify-between"
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
                    <p className="text-text-light leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
