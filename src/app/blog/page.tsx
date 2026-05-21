import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, siteConfig } from '@/data';
import { generateBreadcrumbs } from '@/lib/utils';
import HeroSection from '@/components/sections/HeroSection';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Physiotherapy Blog | Expert Tips & Guides by Dr. Shiva Jain',
  description:
    'Evidence-based physiotherapy articles, exercise guides, and health tips by Dr. Shiva Jain Sangoi. Learn about back pain, posture correction, sports injuries, and more.',
  keywords: [
    'physiotherapy blog',
    'physiotherapy tips',
    'exercise guides',
    'back pain articles',
    'posture correction',
    'sports injury prevention',
    'physiotherapist Borivali blog',
  ],
  openGraph: {
    title: 'Physiotherapy Blog | PhysioSthanak',
    description:
      'Expert physiotherapy articles and exercise guides by Dr. Shiva Jain Sangoi, Borivali West.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/blog`,
    siteName: siteConfig.businessName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PhysioSthanak Blog',
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.domain}/blog`,
  },
};

const breadcrumbs = generateBreadcrumbs('/blog');

export default function BlogPage() {
  // Sort posts by date, newest first
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        h1="Physiotherapy Blog"
        description="Evidence-based articles, exercise guides, and health tips by Dr. Shiva Jain Sangoi. Real advice from a practising physiotherapist — no fluff, no jargon."
        breadcrumbs={breadcrumbs}
        pageName="Blog"
      />

      {/* Blog Listing */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-border-light rounded-lg overflow-hidden card-shadow hover:shadow-xl transition-all group"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-wider rounded-full mb-4">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-heading font-bold text-accent mb-3 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="text-text-light text-sm leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-text-light mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.publishDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                    <div>
                      <p className="text-sm font-semibold text-accent">
                        {post.author}
                      </p>
                      <p className="text-xs text-text-light">
                        {post.authorCredentials.split(',').slice(0, 2).join(',')}
                      </p>
                    </div>
                  </div>

                  {/* Read More */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 mt-4 text-primary font-heading font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-bg-lighter">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
            Have a Question About Your Condition?
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto mb-8">
            If you&apos;re dealing with pain or a movement problem, don&apos;t wait.
            Book an assessment with Dr. Shiva Jain and get answers specific to your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
              Book Appointment
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-block px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
