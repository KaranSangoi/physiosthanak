import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

interface AreaCardProps {
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export default function AreaCard({
  name,
  slug,
  description,
  image,
}: AreaCardProps) {
  return (
    <Link href={`/service-areas/${slug}`}>
      <div className="bg-white rounded-lg overflow-hidden card-shadow h-full hover:shadow-xl transition-all duration-300 group">
        {image && (
          <div className="relative h-48 overflow-hidden bg-bg-light">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <h3 className="text-xl font-bold text-accent group-hover:text-primary transition-colors">
              {name}
            </h3>
          </div>
          <p className="text-text-light text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
            Explore Services
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
