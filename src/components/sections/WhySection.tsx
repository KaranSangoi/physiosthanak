import { WhyPoint } from '@/types';
import Image from 'next/image';

interface WhySectionProps {
  heading: string;
  subheading?: string;
  whyPoints: WhyPoint[];
  image?: string;
}

export default function WhySection({
  heading,
  subheading,
  whyPoints,
  image,
}: WhySectionProps) {
  return (
    <section className="section-padding bg-bg-lighter">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
              {heading}
            </h2>
            {subheading && (
              <p className="text-lg text-text-light mb-8">
                {subheading}
              </p>
            )}

            <div className="space-y-6">
              {whyPoints.map((point, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-2">
                      {point.title}
                    </h3>
                    <p className="text-text-light leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          {image && (
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image}
                alt={heading}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
