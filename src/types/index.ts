export interface FAQ {
  question: string;
  answer: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface WhyPoint {
  title: string;
  description: string;
}

export interface SiteConfig {
  businessName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  bookingUrl: string;
  social: {
    instagram: string;
    linkedin: string;
  };
  domain: string;
  doctorName: string;
  doctorCredentials: string;
  googleReviewUrl: string;
  googleMapsPlaceUrl: string;
  reviewCount: number;
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  metaDescription: string;
  h1: string;
  heroDescription: string;
  benefits: Benefit[];
  whyPoints: WhyPoint[];
  faqs: FAQ[];
  image: string;
  externalLink?: { url: string; text: string };
}

export interface PAAItem {
  question: string;
  answer: string;
}

export interface ConditionPage {
  slug: string;
  name: string;
  parentCategory: string;
  description: string;
  keywords: string[];
  metaDescription: string;
  h1: string;
  heroDescription: string;
  benefits: Benefit[];
  whyPoints: WhyPoint[];
  faqs: FAQ[];
  externalLink?: { url: string; text: string };
  paa?: PAAItem[];
}

export interface ServiceCategory extends Service {
  conditions: ConditionPage[];
  whatIs?: string;
}

export interface SubArea {
  slug: string;
  name: string;
  parentArea: string;
  description: string;
  keywords: string[];
  metaDescription: string;
  h1: string;
  heroDescription: string;
  benefits: Benefit[];
  whyPoints: WhyPoint[];
  faqs: FAQ[];
  mapDescription: string;
  externalLink?: { url: string; text: string };
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  publishDate: string;
  updatedDate?: string;
  author: string;
  authorCredentials: string;
  excerpt: string;
  readTime: string;
  category: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  content: string;
  faqs: FAQ[];
  relatedServices: string[];
  relatedAreas?: string[];
}

export interface ServiceArea {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  metaDescription: string;
  h1: string;
  heroDescription: string;
  benefits: Benefit[];
  whyPoints: WhyPoint[];
  faqs: FAQ[];
  mapDescription: string;
  externalLink?: { url: string; text: string };
  subAreas: SubArea[];
}
