import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { ArrowRight, Calendar } from 'lucide-react';

// Homepage "From the Blog" section — links the newest posts from the site's
// strongest page so Google discovers and indexes them without manual
// URL-inspection requests (the "Discovered - currently not indexed" fix).
export default function LatestBlogPosts({ maxPosts = 3 }: { maxPosts?: number }) {
  const latest = [...blogPosts]
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
    .slice(0, maxPosts);

  if (latest.length === 0) return null;

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="section-eyebrow">Expert Insights</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-dark uppercase">
            Latest from the Blog
          </h2>
          <p className="text-text-light mt-3 max-w-2xl mx-auto">
            Practical recovery guides and exercise advice from Dr. Shiva Jain Sangoi (PT).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-border-light"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-accent-pink bg-accent-pink/10 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-text-light flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-text-dark group-hover:text-accent-pink transition-colors leading-snug mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-text-light leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-heading font-bold uppercase tracking-wide text-accent-pink">
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-accent-pink font-heading font-bold uppercase tracking-wide hover:gap-3 transition-all"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
