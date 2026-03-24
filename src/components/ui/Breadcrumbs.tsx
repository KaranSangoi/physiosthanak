import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://physiosthanak.com'}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-text-light"
      >
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            <Link
              href={item.href}
              className="text-primary hover:text-primary-dark transition-colors underline"
            >
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <span className="text-text-light">/</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
