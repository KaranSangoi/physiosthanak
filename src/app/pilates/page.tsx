import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { siteConfig } from '@/data/site-config';
import type { PilatesBatch } from '@/types/pilates';
import PilatesContent from './PilatesContent';

export const revalidate = 60; // ISR — revalidate every 60 seconds

export const metadata: Metadata = {
  title: 'Online Mat Pilates Classes for Women',
  description:
    'Live online women-only Mat Pilates by Dr. Shiva Jain Sangoi (MPTh Ortho) & her team. Free pre & post assessment with goal setting. Max 4 per batch. Register now.',
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
    title: 'Online Mat Pilates for Women | PhysioSthanak',
    description:
      'Live online women-only Mat Pilates with free pre & post biomechanical assessment. Max 4 per batch. Led by Dr. Shiva Jain Sangoi (MPTh Ortho) & her team.',
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
    title: 'Online Mat Pilates for Women | PhysioSthanak',
    description:
      'Live online women-only Mat Pilates with free pre & post assessment. Only 4 seats per batch.',
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
