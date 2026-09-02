import { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  businessName: 'PhysioSthanak',
  tagline: 'Move \u2022 Heal \u2022 Improve',
  phone: '+91 9324254297',
  email: 'physiosthanak@gmail.com',
  address: 'Shop No. 14, Ground Floor, Hari-Smruti Premises, Sardar Vallabhbhai Patel Rd, opp. HDFC Bank, Borivali West, Mumbai, Maharashtra 400092',
  // "Book" CTAs open WhatsApp with a booking message (free first consultation).
  // Topmate (paid) is reserved for the Instagram audience, shared via chat.
  bookingUrl: 'https://wa.me/919324254297?text=Hi%20PhysioSthanak%2C%20I%20would%20like%20to%20book%20my%20FREE%20first%20clinic%20consultation',
  social: {
    instagram: 'https://www.instagram.com/physiosthanak',
    linkedin: 'http://www.linkedin.com/in/drshivajain',
  },
  domain: 'https://physiosthanak.com',
  doctorName: 'Dr. Shiva Jain Sangoi',
  doctorCredentials: 'BPTh, MPTh (Ortho), FIFA Diploma in Football Medicine, 10+ Years Experience, 8000+ Cases Treated',
  googleReviewUrl: 'https://g.page/r/CQu9kCmpQ9u2EBM/review',
  googleMapsPlaceUrl: 'https://www.google.com/maps/place/PhysioSthanak+-+Physiotherapy+Center+in+Borivali/@19.2328584,72.8559077,17z/data=!3m1!4b1!4m6!3m5!1s0x65dadd98618b2cff:0xb6db43a92990bd0b!8m2!3d19.2328584!4d72.8559077!16s%2Fg%2F11wbhkvhkx',
  /**
   * FALLBACK ONLY — do not hand-edit this to "keep it current".
   *
   * The live review count is fetched from Featurable at build time by
   * `getReviewStats()` in src/lib/reviews.ts, and that is what every page and
   * every schema block actually renders. This number is used only when that
   * fetch fails (network error, timeout, bad payload).
   *
   * If you ever see a stale count on the live site, the bug is in the fetch —
   * editing this line will hide it rather than fix it.
   */
  reviewCount: 73,
};
