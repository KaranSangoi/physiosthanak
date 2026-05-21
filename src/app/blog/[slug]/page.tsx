import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts, siteConfig } from '@/data';
import { generateBreadcrumbs } from '@/lib/utils';
import HeroSection from '@/components/sections/HeroSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import { Clock, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      locale: 'en_IN',
      url: `${siteConfig.domain}/blog/${post.slug}`,
      siteName: siteConfig.businessName,
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate || post.publishDate,
      authors: [post.author],
      images: [
        {
          url: post.featuredImage || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.featuredImageAlt || post.title,
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.domain}/blog/${post.slug}`,
    },
  };
}

function renderMarkdown(content: string): string {
  // Simple markdown to HTML conversion for blog content
  let html = content;

  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-heading font-bold text-accent mt-8 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-heading font-bold text-accent mt-10 mb-4">$1</h2>');

  // Links - internal and external
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    if (url.startsWith('/') || url.startsWith('https://physiosthanak.com')) {
      return `<a href="${url}" class="text-accent-pink hover:underline font-medium">${text}</a>`;
    }
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-accent-pink hover:underline font-medium">${text}</a>`;
  });

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-accent">$1</strong>');

  // Lists
  html = html.replace(/^- (.*$)/gm, '<li class="ml-4 text-text-light leading-relaxed">$1</li>');
  // Wrap consecutive li elements in ul
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul class="list-disc pl-4 space-y-2 my-4">$1</ul>');

  // Numbered lists
  html = html.replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 text-text-light leading-relaxed" value="$1">$2</li>');

  // Paragraphs - wrap lines that aren't already wrapped in tags
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol') ||
        trimmed.startsWith('<li')
      ) {
        return trimmed;
      }
      return `<p class="text-text-light leading-relaxed mb-4">${trimmed}</p>`;
    })
    .join('\n');

  return html;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title, href: `/blog/${post.slug}` },
  ];

  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  // Article schema markup
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: post.featuredImage || `${siteConfig.domain}/og-image.jpg`,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: 'Physiotherapist',
      worksFor: {
        '@type': 'MedicalBusiness',
        name: siteConfig.businessName,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.businessName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.domain}/images/logo-header.png`,
      },
    },
    datePublished: post.publishDate,
    dateModified: post.updatedDate || post.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.domain}/blog/${post.slug}`,
    },
  };

  // MedicalWebPage schema for health content
  const medicalSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: post.title,
    description: post.metaDescription,
    lastReviewed: post.updatedDate || post.publishDate,
    reviewedBy: {
      '@type': 'Person',
      name: post.author,
      credential: post.authorCredentials,
    },
  };

  const contentHtml = renderMarkdown(post.content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }}
      />

      {/* Hero Section */}
      <HeroSection
        h1={post.title}
        description={post.excerpt}
        breadcrumbs={breadcrumbs}
        pageName="Blog Article"
      />

      {/* Article Content */}
      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-border-light">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-wider rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-sm text-text-light">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1 text-sm text-text-light">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          {/* Author Box */}
          <div className="flex items-start gap-4 mb-10 p-4 bg-bg-lighter rounded-lg">
            <div>
              <p className="font-heading font-bold text-accent">
                {post.author}
              </p>
              <p className="text-sm text-text-light">
                {post.authorCredentials}
              </p>
            </div>
          </div>

          {/* Article Body */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </article>

      {/* FAQ Section */}
      {post.faqs.length > 0 && (
        <FAQSection
          heading={`Questions About ${post.category === 'Guide' ? 'This Topic' : post.category}`}
          faqs={post.faqs}
        />
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-bg-lighter">
          <div className="container-max">
            <div className="text-center mb-10">
              <span className="section-eyebrow">Keep Reading</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-accent uppercase">
                Related Articles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relPost) => (
                <article
                  key={relPost.slug}
                  className="bg-white border border-border-light rounded-lg overflow-hidden card-shadow hover:shadow-xl transition-all group"
                >
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-heading font-bold uppercase tracking-wider rounded-full mb-3">
                      {relPost.category}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-accent mb-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${relPost.slug}`}>
                        {relPost.title}
                      </Link>
                    </h3>
                    <p className="text-text-light text-sm leading-relaxed mb-4">
                      {relPost.excerpt.substring(0, 120)}...
                    </p>
                    <Link
                      href={`/blog/${relPost.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-heading font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all"
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary font-heading font-bold uppercase tracking-wider hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection
        heading="Ready to Start Your Recovery?"
        description={`Expert physiotherapy by ${siteConfig.doctorName}. Book your consultation and get a personalised treatment plan.`}
      />
    </>
  );
}
