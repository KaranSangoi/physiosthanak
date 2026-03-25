import { WhyPoint } from '@/types';
import Image from 'next/image';

const DEFAULT_IMAGE = '/images/services/physiotherapy.jpg';

interface WhySectionProps {
  heading: string;
  subheading?: string;
  whyPoints: WhyPoint[];
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
}

export default function WhySection({
  heading,
  subheading,
  whyPoints,
  image,
  imageAlt,
  eyebrow,
}: WhySectionProps) {
  const imgSrc = image || DEFAULT_IMAGE;
  const alt = imageAlt || heading;

  return (
    <section className="section-padding bg-bg-light">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <div>
            {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent mb-4 uppercase">
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
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-accent mb-2 uppercase">
                      {point.title}
                    </h3>
                    <p className="text-text-light leading-relaxed text-sm">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[250px] sm:h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-xl bg-bg-lighter">
            <Image
              src={imgSrc}
              alt={alt}
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
