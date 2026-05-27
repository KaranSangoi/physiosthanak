import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/llms.txt', '/llms-full.txt', '/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/llms.txt', '/llms-full.txt', '/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/llms.txt', '/llms-full.txt', '/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/llms.txt', '/llms-full.txt', '/ai.txt', '/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/llms.txt', '/llms-full.txt', '/ai.txt', '/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: ['/llms.txt', '/llms-full.txt', '/ai.txt', '/'],
      },
      {
        userAgent: 'Bytespider',
        allow: ['/llms.txt', '/llms-full.txt', '/ai.txt', '/'],
      },
      {
        userAgent: 'CCBot',
        allow: ['/llms.txt', '/llms-full.txt', '/ai.txt', '/'],
      },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
  };
}
