import type { MetadataRoute } from 'next';
import { allServices, serviceAreas, blogPosts, siteConfig } from '@/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.domain;
  const today = new Date().toISOString().split('T')[0];

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/service-areas`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pilates`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Add blog listing page
  routes.push({
    url: `${baseUrl}/blog`,
    lastModified: today,
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // Add individual blog posts
  blogPosts.forEach((post) => {
    routes.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedDate || post.publishDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // Add ALL service category pages (12 categories)
  allServices.forEach((service) => {
    routes.push({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    // Add condition pages
    if (service.conditions && service.conditions.length > 0) {
      service.conditions.forEach((condition) => {
        routes.push({
          url: `${baseUrl}/services/${service.slug}/${condition.slug}`,
          lastModified: today,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }
  });

  // Add area pages
  serviceAreas.forEach((area) => {
    routes.push({
      url: `${baseUrl}/service-areas/${area.slug}`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.8,
    });

    // Add sub-area pages
    if (area.subAreas && area.subAreas.length > 0) {
      area.subAreas.forEach((subArea) => {
        routes.push({
          url: `${baseUrl}/service-areas/${area.slug}/${subArea.slug}`,
          lastModified: today,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }
  });

  return routes;
}
