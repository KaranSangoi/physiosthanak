import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { siteConfig } from '@/data/site-config';
import type { PilatesBatch } from '@/types/pilates';
import PilatesContent from './PilatesContent';

export const revalidate = 60; // ISR — revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Mat Pilates for Women in Borivali | Physiotherapist-Led Classes',
  description:
    'Women-only Mat Pilates classes led by Dr. Shiva Jain Sangoi (MPTh Ortho) in Borivali West, Mumbai. Free biomechanical assessment. Online & offline batches available. Register now.',
  keywords: [
    'mat pilates borivali',
    'pilates classes mumbai',
    'pilates for women mumbai',
    'women only pilates borivali',
    'physiotherapist led pilates',
    'pilates near me borivali',
    'online pilates classes india',
    'pilates for back pain',
    'clinical pilates mumbai',
    'mat pilates for beginners',
    'pilates borivali west',
    'pilates with physiotherapist',
    'ladies pilates classes mumbai',
  ],
  openGraph: {
    title: 'Mat Pilates for Women in Borivali | PhysioSthanak',
    description:
      'Women-only Mat Pilates classes with free biomechanical assessment. Online & offline batches. Led by Dr. Shiva Jain Sangoi (MPTh Ortho).',
    url: `${siteConfig.domain}/pilates`,
    siteName: siteConfig.businessName,
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/images/pilates-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Mat Pilates for Women in Borivali by PhysioSthanak',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mat Pilates for Women in Borivali | PhysioSthanak',
    description:
      'Women-only Mat Pilates with free biomechanical assessment. Online & offline batches available.',
    images: ['/images/pilates-og.jpg'],
  },
  alternates: {
    canonical: `${siteConfig.domain}/pilates`,
  },
};

export default async function PilatesPage() {
  // Use base Supabase client (no cookies) so the page stays ISR-compatible
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: batches } = await supabase
    .from('pilates_batches')
    .select('id, name, type, schedule, days, time, capacity, current_count, is_active')
    .eq('is_active', true)
    .order('type', { ascending: true })
    .order('days', { ascending: true })
    .order('time', { ascending: true });

  return <PilatesContent batches={(batches as PilatesBatch[]) ?? []} />;
}
