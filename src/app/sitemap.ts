import type { MetadataRoute } from 'next';
import { services, serviceAreas, siteConfig } from '@/data';

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
      url: `${baseUrl}/contact`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ];

  // Add service category pages
  services.forEach((service) => {
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
