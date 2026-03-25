import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  dark?: boolean;
}

export default function Breadcrumbs({ items, dark = false }: BreadcrumbsProps) {
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
        className={`flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm ${dark ? 'text-slate-400' : 'text-text-light'}`}
      >
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center gap-2">
            <Link
              href={item.href}
              className={`${dark ? 'text-accent-pink hover:text-white' : 'text-primary hover:text-primary-dark'} transition-colors underline`}
            >
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <span className={dark ? 'text-slate-500' : 'text-text-light'}>/</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
