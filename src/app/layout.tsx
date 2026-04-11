import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { siteConfig } from '@/data/site-config';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

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
  verification: {
    google: 'H0GKBQSKXy--f3idl1hm8Z2Tgpygi-OyS4pO-65THUY',
  },
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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#14507c" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />

        {/* Google Analytics (GA4) — loaded after page is interactive, not render-blocking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5M0KHWWZ42"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5M0KHWWZ42');`}
        </Script>
      </body>
    </html>
  );
}
