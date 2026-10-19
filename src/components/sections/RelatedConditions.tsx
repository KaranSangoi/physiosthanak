import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { allServices } from '@/data';

// Deep condition pages (/services/<category>/<condition>) were reachable only
// from their own category page, and 0 of 9 manual indexing requests on such
// pages moved in 14 days (Sep 17–Oct 1, 2026) while homepage-linked posts
// indexed in 3–6 days. This block gives every condition page inbound links
// from its siblings, from a rotating set of other categories, and from the
// locality pages — the site's strongest-ranking template.

export interface ConditionLink {
  href: string;
  name: string;
  category: string;
}

export function allConditionLinks(): ConditionLink[] {
  const links: ConditionLink[] = [];
  allServices.forEach((service) => {
    (service.conditions ?? []).forEach((c) => {
      links.push({
        href: `/services/${service.slug}/${c.slug}`,
        name: c.name,
        category: service.name,
      });
    });
  });
  return links;
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic rotation through the full condition list, seeded by the page slug. */
export function rotatedConditions(
  seed: string,
  count: number,
  exclude: (link: ConditionLink) => boolean = () => false,
): ConditionLink[] {
  const pool = allConditionLinks()
    .filter((l) => !exclude(l))
    .sort((a, b) => a.href.localeCompare(b.href));
  if (pool.length === 0) return [];
  const start = hashSeed(seed) % pool.length;
  const step = 7;
  const out: ConditionLink[] = [];
  const seen = new Set<string>();
  for (let i = 0; out.length < Math.min(count, pool.length); i++) {
    const link = pool[(start + i * step) % pool.length];
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    out.push(link);
  }
  return out;
}

interface Props {
  /** Current category slug — its sibling conditions are listed first. Omit on locality pages. */
  categorySlug?: string;
  /** Current condition slug, excluded from the list. */
  currentSlug?: string;
  /** Seed for the cross-category rotation (condition slug or area slug). */
  seed: string;
  heading: string;
  intro: string;
  /** How many cross-category links to add after the siblings. */
  extra?: number;
}

export default function RelatedConditions({
  categorySlug,
  currentSlug,
  seed,
  heading,
  intro,
  extra = 3,
}: Props) {
  const currentHref =
    categorySlug && currentSlug ? `/services/${categorySlug}/${currentSlug}` : '';
  const siblings = categorySlug
    ? allConditionLinks().filter(
        (l) => l.href.startsWith(`/services/${categorySlug}/`) && l.href !== currentHref,
      )
    : [];
  const siblingHrefs = new Set(siblings.map((l) => l.href));
  const others = rotatedConditions(
    seed,
    extra,
    (l) => l.href === currentHref || siblingHrefs.has(l.href),
  );
  const links = [...siblings, ...others];
  if (links.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-10">
          <span className="section-eyebrow">Conditions We Treat</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-dark uppercase">
            {heading}
          </h2>
          <p className="text-text-light mt-3 max-w-2xl mx-auto">{intro}</p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border-light bg-bg-light px-5 py-4 hover:border-accent-pink hover:shadow-md transition-all"
              >
                <span>
                  <span className="block font-heading font-bold text-text-dark group-hover:text-accent-pink transition-colors">
                    {link.name}
                  </span>
                  <span className="block text-xs uppercase tracking-wider text-text-light mt-1">
                    {link.category}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 shrink-0 text-accent-pink group-hover:translate-x-1 transition-transform" />
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-center mt-8">
          <Link
            href="/conditions"
            className="font-heading font-bold uppercase tracking-wide text-accent-pink hover:underline"
          >
            See all conditions we treat
          </Link>
        </p>
      </div>
    </section>
  );
}
