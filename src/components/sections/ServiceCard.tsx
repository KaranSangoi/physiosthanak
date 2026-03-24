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
          <h3 className="text-xl font-bold text-accent mb-3 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-text-light text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
          <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
            Learn More
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
