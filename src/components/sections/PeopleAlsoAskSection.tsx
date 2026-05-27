import type { PAAItem } from '@/types';

interface PeopleAlsoAskSectionProps {
  conditionName: string;
  items: PAAItem[];
}

export default function PeopleAlsoAskSection({ conditionName, items }: PeopleAlsoAskSectionProps) {
  if (!items || items.length === 0) return null;

  const paaSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(paaSchema) }}
      />
      <section className="section-padding bg-gray-50">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-accent mb-8">
            People Also Ask About {conditionName}
          </h2>
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-accent mb-3">
                  {item.question}
                </h3>
                <p className="text-text-secondary leading-relaxed" data-speakable="true">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
