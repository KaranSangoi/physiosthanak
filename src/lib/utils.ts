import { services } from '@/data/services';
import { servicesExtended } from '@/data/services-extended';
import { servicesExtended2 } from '@/data/services-extended2';
import { servicesExtended3 } from '@/data/services-extended3';
import { servicesOnline } from '@/data/services-online';
import { serviceAreas } from '@/data/service-areas';
import { ServiceCategory, ServiceArea, SubArea, ConditionPage } from '@/types';

const allServicesInternal: ServiceCategory[] = [
  ...services,
  ...servicesExtended,
  ...servicesExtended2,
  ...servicesExtended3,
  ...servicesOnline,
];

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return allServicesInternal.find((service) => service.slug === slug);
}

export function getConditionBySlug(
  categorySlug: string,
  conditionSlug: string
): ConditionPage | undefined {
  const category = getServiceBySlug(categorySlug);
  if (!category) return undefined;
  return category.conditions.find((condition) => condition.slug === conditionSlug);
}

export function getAreaBySlug(slug: string): ServiceArea | undefined {
  return serviceAreas.find((area) => area.slug === slug);
}

export function getSubAreaBySlug(
  areaSlug: string,
  subAreaSlug: string
): SubArea | undefined {
  const area = getAreaBySlug(areaSlug);
  if (!area) return undefined;
  return area.subAreas.find((subArea) => subArea.slug === subAreaSlug);
}

export function getAllServiceSlugs(): { category: string; condition?: string }[] {
  const slugs: { category: string; condition?: string }[] = [];

  services.forEach((service) => {
    // Add category slug
    slugs.push({ category: service.slug });

    // Add condition slugs
    if (service.conditions.length > 0) {
      service.conditions.forEach((condition) => {
        slugs.push({ category: service.slug, condition: condition.slug });
      });
    }
  });

  return slugs;
}

export function getAllAreaSlugs(): { area: string; subArea?: string }[] {
  const slugs: { area: string; subArea?: string }[] = [];

  serviceAreas.forEach((area) => {
    // Add area slug
    slugs.push({ area: area.slug });

    // Add sub-area slugs
    area.subAreas.forEach((subArea) => {
      slugs.push({ area: area.slug, subArea: subArea.slug });
    });
  });

  return slugs;
}

export function generateBreadcrumbs(
  path: string
): { label: string; href: string }[] {
  const segments = path.split('/').filter((s) => s);
  const breadcrumbs: { label: string; href: string }[] = [
    { label: 'Home', href: '/' },
  ];

  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Handle services
    if (segment === 'services') {
      breadcrumbs.push({ label: 'Services', href: '/services' });
    } else if (i > 0 && segments[i - 1] === 'services') {
      // Service category or condition
      const categorySlug = segment;
      const category = getServiceBySlug(categorySlug);
      if (category) {
        breadcrumbs.push({ label: category.name, href: currentPath });
      }
    } else if (i > 1 && segments[i - 2] === 'services' && segments[i - 1] !== 'services') {
      // Condition page
      const categorySlug = segments[i - 1];
      const conditionSlug = segment;
      const condition = getConditionBySlug(categorySlug, conditionSlug);
      if (condition) {
        breadcrumbs.push({ label: condition.name, href: currentPath });
      }
    }

    // Handle blog
    if (segment === 'blog') {
      breadcrumbs.push({ label: 'Blog', href: '/blog' });
    }

    // Handle service-areas
    if (segment === 'service-areas') {
      breadcrumbs.push({ label: 'Service Areas', href: '/service-areas' });
    } else if (i > 0 && segments[i - 1] === 'service-areas') {
      // Area page
      const areaSlug = segment;
      const area = getAreaBySlug(areaSlug);
      if (area) {
        breadcrumbs.push({ label: area.name, href: currentPath });
      }
    } else if (i > 1 && segments[i - 2] !== 'services') {
      // Sub-area page (3rd segment that isn't under /services/)
      const areaSlug = segments[i - 1];
      const subAreaSlug = segment;
      const subArea = getSubAreaBySlug(areaSlug, subAreaSlug);
      if (subArea) {
        breadcrumbs.push({ label: subArea.name, href: currentPath });
      }
    }
  }

  return breadcrumbs;
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Handle Indian phone numbers
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const withoutCountry = cleaned.slice(2);
    return `+91 ${withoutCountry.slice(0, 4)} ${withoutCountry.slice(4, 7)} ${withoutCountry.slice(7)}`;
  }

  // Return original if unable to format
  return phone;
}
