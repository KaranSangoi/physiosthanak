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
        <div className="text-center mb-14">
          <span className="section-eyebrow">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
            {heading}
          </h2>
          {subheading && (
            <p className="text-lg text-text-light max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-primary/20"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-bold text-accent uppercase mb-3">
                {benefit.title}
              </h3>
              <p className="text-text-light leading-relaxed text-sm">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
