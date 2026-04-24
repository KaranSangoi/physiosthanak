import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
    images: {
          formats: ['image/avif', 'image/webp'],
    },
    async headers() {
          return [
            {
                      // Cache static assets (images, fonts, icons) for 1 year
                    source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|eot)',
                      headers: [
                        {
                                      key: 'Cache-Control',
                                      value: 'public, max-age=31536000, immutable',
                        },
                                ],
            },
            {
                      // Cache JS and CSS chunks for 1 year (they have content hashes)
                    source: '/_next/static/:path*',
                      headers: [
                        {
                                      key: 'Cache-Control',
                                      value: 'public, max-age=31536000, immutable',
                        },
                                ],
            },
                ];
    },
    async redirects() {
          return [
                  // Old WordPress pages - 301 permanent redirects to homepage
            {
                      source: '/hello-world-2',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/hello-world-2/',
                      destination: '/',
                      permanent: true,
            },
                  // Old WordPress admin and server paths
            {
                      source: '/wp-admin/:path*',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/cgi-bin/:path*',
                      destination: '/',
                      permanent: true,
            },
                  // Old WordPress common paths
            {
                      source: '/wp-login.php',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-content/:path*',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/xmlrpc.php',
                      destination: '/',
                      permanent: true,
            },
                  // WordPress paths returning 403 on Vercel — redirect to homepage
            {
                      source: '/wp-includes/:path*',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-json/:path*',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-cron.php',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-config.php',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-comments-post.php',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-signup.php',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-trackback.php',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-links-opml.php',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/wp-mail.php',
                      destination: '/',
                      permanent: true,
            },
                ];
    },
};

export default nextConfig;
