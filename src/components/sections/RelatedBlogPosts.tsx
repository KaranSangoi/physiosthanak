import Link from 'next/link';
import { blogPosts } from '@/data/blog';
import { ArrowRight, Calendar } from 'lucide-react';

interface RelatedBlogPostsProps {
  serviceSlug: string;
  heading?: string;
  maxPosts?: number;
}

export default function RelatedBlogPosts({
  serviceSlug,
  heading = 'Related Articles from Our Blog',
  maxPosts = 3,
}: RelatedBlogPostsProps) {
  const relatedPosts = blogPosts
    .filter((post) => post.relatedServices.includes(serviceSlug))
    .slice(0, maxPosts);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="section-padding bg-bg-light">
      <div className="container-max">
        <div className="text-center mb-12">
          <span className="section-eyebrow">Expert Insights</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-text-dark uppercase">
            {heading}
          </h2>
          <p className="text-text-light mt-3 max-w-2xl mx-auto">
            Learn more about your condition, treatment options, and recovery tips from Dr. Shiva Jain.
          </p>
        </div>

        <div className={`grid grid-cols-1 ${relatedPosts.length > 1 ? 'md:grid-cols-2' : ''} ${relatedPosts.length > 2 ? 'lg:grid-cols-3' : ''} gap-8`}>
          {relatedPosts.map((post) => (
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
                <h3 className="font-heading font-bold text-text-dark text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-text-light text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-accent-pink font-heading font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-accent-pink font-heading font-bold uppercase tracking-wider transition-colors"
          >
            View All Blog Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
