import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnalyticsEvents from '@/components/AnalyticsEvents';
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
    template: `%s | 5.0★ ${siteConfig.businessName}`,
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
        {/* Global Entity Schema — Organization + Person for AI knowledge graphs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': ['MedicalBusiness', 'Physiotherapy', 'LocalBusiness'],
                  '@id': 'https://physiosthanak.com/#organization',
                  name: 'PhysioSthanak',
                  alternateName: 'PhysioSthanak - Physiotherapy Center',
                  description: 'Expert physiotherapy clinic in Borivali West, Mumbai offering 12 specialized services including sports rehabilitation, neurological physiotherapy, home visits, and online consultations. Led by Dr. Shiva Jain Sangoi with 9+ years experience and 8000+ cases treated.',
                  url: 'https://physiosthanak.com',
                  telephone: '+919324254297',
                  email: 'physiosthanak@gmail.com',
                  foundingDate: '2025',
                  slogan: 'Move . Heal . Improve',
                  logo: 'https://physiosthanak.com/images/logo.png',
                  image: 'https://physiosthanak.com/og-image.jpg',
                  priceRange: '$$',
                  currenciesAccepted: 'INR',
                  paymentAccepted: 'Cash, UPI, Debit Card, Credit Card',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Shop No. 14, Ground Floor, Hari-Smruti Premises, Sardar Vallabhbhai Patel Rd, opp. HDFC Bank',
                    addressLocality: 'Borivali West',
                    addressRegion: 'Maharashtra',
                    postalCode: '400092',
                    addressCountry: 'IN',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 19.2307,
                    longitude: 72.8567,
                  },
                  areaServed: [
                    { '@type': 'City', name: 'Mumbai' },
                    { '@type': 'Place', name: 'Borivali West' },
                    { '@type': 'Place', name: 'Borivali East' },
                    { '@type': 'Place', name: 'Dahisar' },
                    { '@type': 'Place', name: 'Kandivali' },
                    { '@type': 'Place', name: 'Malad' },
                  ],
                  openingHoursSpecification: [
                    {
                      '@type': 'OpeningHoursSpecification',
                      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                      opens: '09:00',
                      closes: '18:00',
                    },
                  ],
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '5.0',
                    ratingCount: String(siteConfig.reviewCount),
                    reviewCount: String(siteConfig.reviewCount),
                    bestRating: '5',
                    worstRating: '1',
                  },
                  sameAs: [
                    'https://www.instagram.com/physiosthanak',
                    'https://www.linkedin.com/in/drshivajain',
                    'https://g.co/kgs/PhysioSthanak',
                  ],
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Physiotherapy Services',
                    itemListElement: [
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Physiotherapy' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Visit Physiotherapy' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sports Injury Physiotherapy' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Back Pain & Spine Treatment' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Neck Pain & Cervical Treatment' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Post-Surgery Rehabilitation' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Neurological Physiotherapy' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Orthopedic Physiotherapy' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pediatric Physiotherapy' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: "Women's Health Physiotherapy" } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hand & Wrist Physiotherapy' } },
                      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Online Physiotherapy' } },
                    ],
                  },
                  founder: { '@id': 'https://physiosthanak.com/#doctor' },
                  employee: { '@id': 'https://physiosthanak.com/#doctor' },
                },
                {
                  '@type': 'Person',
                  '@id': 'https://physiosthanak.com/#doctor',
                  name: 'Dr. Shiva Jain Sangoi',
                  jobTitle: 'Founder & Lead Physiotherapist',
                  description: 'Dr. Shiva Jain Sangoi is a physiotherapist with MPTh in Orthopaedics and a FIFA Diploma in Football Medicine. With 9+ years of clinical experience and 8000+ successfully treated cases, she specializes in orthopedic rehabilitation, sports injury treatment, and neurological physiotherapy.',
                  url: 'https://physiosthanak.com',
                  image: 'https://physiosthanak.com/images/dr-shiva.jpg',
                  telephone: '+919324254297',
                  email: 'physiosthanak@gmail.com',
                  alumniOf: [
                    { '@type': 'EducationalOrganization', name: 'MPTh Orthopaedics Program' },
                    { '@type': 'EducationalOrganization', name: 'BPTh Program' },
                    { '@type': 'Organization', name: 'FIFA - Football Medicine Diploma' },
                  ],
                  hasCredential: [
                    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MPTh (Orthopaedics)' },
                    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'BPTh' },
                    { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'FIFA Diploma in Football Medicine' },
                  ],
                  knowsAbout: [
                    'Physiotherapy', 'Orthopedic Rehabilitation', 'Sports Injury Treatment',
                    'Neurological Physiotherapy', 'Back Pain Treatment', 'Sciatica Treatment',
                    'Post-Surgery Rehabilitation', 'Mat Pilates', 'Home Visit Physiotherapy',
                  ],
                  worksFor: { '@id': 'https://physiosthanak.com/#organization' },
                  sameAs: [
                    'https://www.linkedin.com/in/drshivajain',
                    'https://www.instagram.com/physiosthanak',
                  ],
                },
              ],
            }),
          }}
        />
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
        {/* Tracks phone / WhatsApp / booking clicks as GA4 events for Ads conversion import */}
        <AnalyticsEvents />
      </body>
    </html>
  );
}
