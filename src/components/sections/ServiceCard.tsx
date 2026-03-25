import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export default function ServiceCard({
  name,
  slug,
  description,
  image,
}: ServiceCardProps) {
  return (
    <Link href={`/services/${slug}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full border border-slate-100">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-bg-light">
          {image ? (
            <>
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Overlay that fades on hover */}
              <div className="absolute inset-0 bg-[#0e1b2d]/20 group-hover:bg-[#0e1b2d]/0 transition-colors duration-300" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent-pink/10 flex items-center justify-center">
              <span className="text-4xl text-primary/30 font-heading font-bold uppercase">PT</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-heading font-bold text-accent uppercase mb-3 group-hover:text-accent-pink transition-colors">
            {name}
          </h3>
          <p className="text-text-light text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
          <div className="flex items-center gap-2 text-accent-pink font-heading font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
            Learn More
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
