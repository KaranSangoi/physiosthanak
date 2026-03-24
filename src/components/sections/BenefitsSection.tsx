import { Benefit } from '@/types';
import { CheckCircle } from 'lucide-react';

interface BenefitsSectionProps {
  heading: string;
  subheading?: string;
  benefits: Benefit[];
}

export default function BenefitsSection({
  heading,
  subheading,
  benefits,
}: BenefitsSectionProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-bg-light rounded-lg p-8 card-shadow"
            >
              <div className="flex gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <h3 className="text-xl font-semibold text-accent">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-text-light leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
