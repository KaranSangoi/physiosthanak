import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { ArrowRight } from 'lucide-react';

// Locality pages (/service-areas/*) are the site's strongest-ranking template
// but linked to zero individual articles. Each locality page now links 3 posts,
// rotated deterministically by the page's slug so the ~100 locality pages
// spread link equity across the whole archive instead of all pointing at the
// same 3 posts. Evidence (Sep 2026): homepage-linked posts indexed in 3–6 days,
// unlinked deep pages 0/9 at day 14 — internal links are the indexing lever.
function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export default function LocalityBlogPosts({
  seed,
  areaName,
  maxPosts = 3,
}: {
  seed: string;
  areaName: string;
  maxPosts?: number;
}) {
  if (blogPosts.length === 0) return null;
  const sorted = [...blogPosts].sort((a, b) => a.slug.localeCompare(b.slug));
  const start = hashSeed(seed) % sorted.length;
  const picks = Array.from({ length: Math.min(maxPosts, sorted.length) }, (_, i) =>
    sorted[(start + i * 7) % sorted.length],
  );

  return (
    <section className="section-padding bg-bg-light">
      <div className="container-max">
        <div className="text-center mb-10">
          <span className="section-eyebrow">Expert Insights</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-dark uppercase">
            Health Guides for {areaName} Residents
          </h2>
          <p className="text-text-light mt-3 max-w-2xl mx-auto">
            Practical recovery advice from Dr. Shiva Jain Sangoi (PT), written for the
            everyday aches that bring our {areaName} patients in.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {picks.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border-light p-6"
            >
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-accent-pink">
                {post.category} · {post.readTime}
              </span>
              <h3 className="mt-2 font-heading font-bold text-lg text-text-dark group-hover:text-accent-pink transition-colors leading-snug">
                {post.title}
              </h3>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-heading font-bold uppercase tracking-wide text-accent-pink">
                Read Article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
