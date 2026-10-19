import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { allServices, siteConfig } from '@/data';

// A–Z index of every condition page, linked from the site footer. Every deep
// /services/<category>/<condition> page is one hop from every page on the site
// through this index — the internal-link path that Google's indexing needed
// (see RelatedConditions.tsx for the evidence).

const TITLE = 'Conditions We Treat — Physiotherapy in Borivali West';
const DESCRIPTION =
  'Every condition PhysioSthanak treats in Borivali West, A to Z — back and neck pain, knee and shoulder injuries, post-surgery and neurological rehab, women’s health and more. Free first consultation at the clinic.';

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | PhysioSthanak` },
  description: DESCRIPTION,
  keywords: [
    'conditions treated physiotherapy borivali',
    'physiotherapy for back pain borivali west',
    'knee pain physiotherapy borivali',
    'post surgery rehabilitation borivali',
    'neurological physiotherapy borivali',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/conditions`,
    siteName: siteConfig.businessName,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'PhysioSthanak' }],
  },
  alternates: { canonical: `${siteConfig.domain}/conditions` },
};

export default function ConditionsIndexPage() {
  const categories = allServices.filter((s) => (s.conditions ?? []).length > 0);
  const total = categories.reduce((n, s) => n + s.conditions.length, 0);

  const sorted = categories
    .flatMap((s) =>
      s.conditions.map((c) => ({
        name: c.name,
        href: `/services/${s.slug}/${c.slug}`,
        category: s.name,
      })),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const groups = new Map<string, typeof sorted>();
  sorted.forEach((item) => {
    const letter = item.name[0].toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), item]);
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: TITLE,
    description: DESCRIPTION,
    url: `${siteConfig.domain}/conditions`,
    isPartOf: { '@id': `${siteConfig.domain}/#organization` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: total,
      itemListElement: sorted.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: `${siteConfig.domain}${item.href}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="container-max px-4 py-8">
        <nav className="flex gap-2 text-sm">
          <Link href="/" className="text-primary hover:text-primary-dark">
            Home
          </Link>
          <span className="text-text-light">/</span>
          <Link href="/services" className="text-primary hover:text-primary-dark">
            Services
          </Link>
          <span className="text-text-light">/</span>
          <span className="text-text-light">Conditions</span>
        </nav>
      </div>

      <section className="section-padding bg-bg-lighter">
        <div className="container-max">
          <h1 className="text-4xl sm:text-5xl font-bold text-accent mb-4">
            Conditions We Treat in Borivali West
          </h1>
          <p className="text-xl text-text-light max-w-3xl">
            {total} conditions, one approach: {siteConfig.doctorName} assesses the whole body
            to find the root cause, not just the painful spot. Each page below explains how
            physiotherapy helps, what to expect, and answers the questions patients ask most.
            Your first consultation at the clinic is free. Not sure which applies to you?{' '}
            <Link href="/contact" className="text-accent-pink hover:underline">
              Tell us your symptoms
            </Link>{' '}
            and we will guide you.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-2xl font-heading font-bold text-text-dark uppercase mb-6">
            By Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {categories.map((s) => (
              <div key={s.slug}>
                <h3 className="font-heading font-bold text-lg text-text-dark mb-3">
                  <Link href={`/services/${s.slug}`} className="hover:text-accent-pink">
                    {s.name}
                  </Link>
                </h3>
                <ul className="space-y-2">
                  {s.conditions.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/services/${s.slug}/${c.slug}`}
                        className="inline-flex items-center gap-2 text-text-dark hover:text-accent-pink transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-accent-pink" />
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-heading font-bold text-text-dark uppercase mb-6">
            A to Z
          </h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
            {[...groups.entries()].map(([letter, items]) => (
              <div key={letter} className="break-inside-avoid mb-6">
                <div className="font-heading font-bold text-accent-pink text-xl mb-2">
                  {letter}
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-text-dark hover:text-accent-pink transition-colors"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs text-text-light"> · {item.category}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-heading font-bold uppercase mb-4">
            Don&apos;t See Your Condition?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Most pain has a cause that sits somewhere other than where it hurts. Book a free
            first consultation at our Borivali West clinic and we will assess it properly.
          </p>
          <Link href="/contact" className="btn-primary">
            Book Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
