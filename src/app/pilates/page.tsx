import type { Metadata } from 'next';
import { siteConfig } from '@/data/site-config';
import PilatesContent from './PilatesContent';

export const metadata: Metadata = {
  title: 'Mat Pilates Classes in Borivali | Physiotherapist-Led',
  description:
    'Join Mat Pilates classes led by Dr. Shiva Jain Sangoi (MPTh Ortho) in Borivali West, Mumbai. Free biomechanical assessment. Online & offline batches available. Register now.',
  keywords: [
    'mat pilates borivali',
    'pilates classes mumbai',
    'physiotherapist led pilates',
    'pilates near me borivali',
    'online pilates classes india',
    'pilates for back pain',
    'clinical pilates mumbai',
    'mat pilates for beginners',
    'pilates borivali west',
    'pilates with physiotherapist',
  ],
  openGraph: {
    title: 'Mat Pilates Classes in Borivali | PhysioSthanak',
    description:
      'Physiotherapist-led Mat Pilates classes with free biomechanical assessment. Online & offline batches. Led by Dr. Shiva Jain Sangoi (MPTh Ortho).',
    url: `${siteConfig.domain}/pilates`,
    siteName: siteConfig.businessName,
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PhysioSthanak Mat Pilates Classes in Borivali',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mat Pilates Classes in Borivali | PhysioSthanak',
    description:
      'Physiotherapist-led Mat Pilates with free biomechanical assessment. Online & offline batches available.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: `${siteConfig.domain}/pilates`,
  },
};

export default function PilatesPage() {
  return <PilatesContent />;
}
