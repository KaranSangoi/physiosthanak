import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.businessName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: `${siteConfig.tagline}. Expert physiotherapy services by ${siteConfig.doctorName} in Borivali, Mumbai. Book your consultation today.`,
  keywords: [
    'physiotherapy',
    'physical therapy',
    'Borivali',
    'Mumbai',
    'pain management',
    'sports injuries',
    'rehabilitation',
  ],
  authors: [
    {
      name: siteConfig.doctorName,
      url: siteConfig.domain,
    },
  ],
  creator: siteConfig.businessName,
  publisher: siteConfig.businessName,
  metadataBase: new URL(siteConfig.domain),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.domain,
    siteName: siteConfig.businessName,
    title: `${siteConfig.businessName} | ${siteConfig.tagline}`,
    description: `${siteConfig.tagline}. Expert physiotherapy services in Borivali, Mumbai.`,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.businessName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.businessName} | ${siteConfig.tagline}`,
    description: `${siteConfig.tagline}. Expert physiotherapy services in Borivali, Mumbai.`,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteConfig.domain,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#14507c" />
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
