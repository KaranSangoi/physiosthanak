import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/data/site-config';
import { MapPin, Phone } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Service Areas', href: '/service-areas' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const services = [
  { name: 'Physiotherapy', href: '/services/physiotherapy' },
  { name: 'Home Visit Physiotherapy', href: '/services/home-visit-physiotherapy' },
  { name: 'Sports Physiotherapy', href: '/services/sports-physiotherapy' },
  { name: 'Back Pain Treatment', href: '/services/back-pain-physiotherapy' },
  { name: 'Neck Pain Treatment', href: '/services/neck-pain-physiotherapy' },
  { name: 'Post-Surgery Rehab', href: '/services/post-surgery-rehabilitation' },
  { name: 'Neurological Physiotherapy', href: '/services/neurological-physiotherapy' },
  { name: 'Orthopedic Physiotherapy', href: '/services/orthopedic-physiotherapy' },
  { name: 'Pediatric Physiotherapy', href: '/services/pediatric-physiotherapy' },
  { name: "Women's Health", href: '/services/womens-health-physiotherapy' },
  { name: 'Hand & Wrist Therapy', href: '/services/hand-physiotherapy' },
  { name: 'Online Physiotherapy', href: '/services/online-physiotherapy' },
];

const serviceAreas = [
  {
    name: 'Borivali',
    slug: 'borivali',
    subAreas: [
      { name: 'Borivali West', slug: 'borivali-west' },
      { name: 'Borivali East', slug: 'borivali-east' },
      { name: 'IC Colony', slug: 'ic-colony' },
      { name: 'Yogi Nagar', slug: 'yogi-nagar' },
      { name: 'Vazira Naka', slug: 'vazira-naka' },
      { name: 'Gorai', slug: 'gorai' },
      { name: 'Eksar', slug: 'eksar' },
      { name: 'MHB Colony', slug: 'mhb-colony' },
      { name: 'Ashok Nagar', slug: 'ashok-nagar' },
      { name: 'Chikoowadi', slug: 'chikoowadi' },
      { name: 'Maharashtra Nagar', slug: 'maharashtra-nagar' },
      { name: 'Daulat Nagar', slug: 'daulat-nagar' },
      { name: 'Saibaba Nagar', slug: 'saibaba-nagar' },
      { name: 'Shimpoli', slug: 'shimpoli' },
      { name: 'Rajendra Nagar', slug: 'rajendra-nagar' },
      { name: 'Kastur Park', slug: 'kastur-park' },
      { name: 'LIC Colony', slug: 'lic-colony' },
      { name: 'Mandapeshwar', slug: 'mandapeshwar' },
      { name: 'Kajupada', slug: 'kajupada' },
      { name: 'Magathane', slug: 'magathane' },
      { name: 'Asha Nagar', slug: 'asha-nagar' },
      { name: 'Dattapada', slug: 'dattapada' },
    ],
  },
  {
    name: 'Dahisar',
    slug: 'dahisar',
    subAreas: [
      { name: 'Dahisar West', slug: 'dahisar-west' },
      { name: 'Dahisar East', slug: 'dahisar-east' },
      { name: 'Kandarpada', slug: 'kandarpada' },
      { name: 'Mhatre Wadi', slug: 'mhatre-wadi' },
      { name: 'Parbat Nagar', slug: 'parbat-nagar' },
      { name: 'Ashok Van', slug: 'ashok-van' },
      { name: 'Ekta Nagar', slug: 'ekta-nagar' },
      { name: 'Shanti Nagar', slug: 'shanti-nagar' },
      { name: 'Anand Nagar', slug: 'anand-nagar' },
      { name: 'Maratha Colony', slug: 'maratha-colony' },
      { name: 'Rawalpada', slug: 'rawalpada' },
      { name: 'Gokul Nagar', slug: 'gokul-nagar' },
      { name: 'Shailendra Nagar', slug: 'shailendra-nagar' },
      { name: 'Ketkipada', slug: 'ketkipada' },
      { name: 'Ovaripada', slug: 'ovaripada' },
    ],
  },
  {
    name: 'Kandivali',
    slug: 'kandivali',
    subAreas: [
      { name: 'Kandivali West', slug: 'kandivali-west' },
      { name: 'Kandivali East', slug: 'kandivali-east' },
      { name: 'Mahavir Nagar', slug: 'mahavir-nagar' },
      { name: 'Dahanukar Wadi', slug: 'dahanukar-wadi' },
      { name: 'Charkop', slug: 'charkop' },
      { name: 'Parekh Nagar', slug: 'parekh-nagar' },
      { name: 'Gandhi Nagar', slug: 'gandhi-nagar' },
      { name: 'Kamla Nagar', slug: 'kamla-nagar' },
      { name: 'Mathuradas Road', slug: 'mathuradas-road' },
      { name: 'Thakur Village', slug: 'thakur-village' },
      { name: 'Lokhandwala Township', slug: 'lokhandwala-township' },
      { name: 'Poisar', slug: 'poisar' },
      { name: 'Hanuman Nagar', slug: 'hanuman-nagar' },
      { name: 'Samata Nagar', slug: 'samata-nagar' },
      { name: 'Damu Nagar', slug: 'damu-nagar' },
      { name: 'Akurli', slug: 'akurli' },
    ],
  },
  {
    name: 'Malad',
    slug: 'malad',
    subAreas: [
      { name: 'Malad West', slug: 'malad-west' },
      { name: 'Malad East', slug: 'malad-east' },
      { name: 'Evershine Nagar', slug: 'evershine-nagar' },
      { name: 'Orlem', slug: 'orlem' },
      { name: 'Chincholi Bunder', slug: 'chincholi-bunder' },
      { name: 'Link Road', slug: 'link-road' },
      { name: 'Marve Road', slug: 'marve-road' },
      { name: 'Kurar Village', slug: 'kurar-village' },
      { name: 'Dindoshi', slug: 'dindoshi' },
      { name: 'Gokuldham', slug: 'gokuldham' },
      { name: 'Nivara Nagari', slug: 'nivara-nagari' },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-slate-400">
      {/* Main Footer Content */}
      <div className="container-max px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/Logo - Physiosthanak (1).png"
                alt="PhysioSthanak"
                width={957}
                height={1101}
                className="h-20 sm:h-24 md:h-28 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              {siteConfig.tagline}
            </p>
            <p className="text-slate-400 text-sm mb-5">
              Expert physiotherapy services by {siteConfig.doctorName} &amp; Team
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-accent-pink rounded-full flex items-center justify-center transition-colors"
                aria-label="Follow PhysioSthanak on Instagram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-accent-pink rounded-full flex items-center justify-center transition-colors"
                aria-label="Connect with Dr. Shiva Jain on LinkedIn"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-bold uppercase tracking-wider mb-6 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 text-sm hover:text-accent-pink transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-heading font-bold uppercase tracking-wider mb-6 text-sm">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-slate-300 text-sm hover:text-accent-pink transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-heading font-bold uppercase tracking-wider mb-6 text-sm">
              Contact Info
            </h4>
            <div className="space-y-4">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-3 text-slate-400 text-sm hover:text-accent-pink transition-colors group"
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span>{siteConfig.phone}</span>
              </a>
              <div className="flex items-start gap-3 text-slate-300 text-sm">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="leading-relaxed">{siteConfig.address}</span>
              </div>
              <a
                href={siteConfig.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 text-sm hover:text-accent-pink transition-colors group mt-2"
              >
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-lg">★</span>
                </div>
                <span>Leave a Google Review</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Service Areas Link Block — SEO internal linking */}
      <div className="border-t border-slate-800">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-10">
          <h4 className="text-white font-heading font-bold uppercase tracking-wider mb-8 text-sm text-center">
            Physiotherapy Near You
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceAreas.map((area) => (
              <div key={area.slug}>
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="text-white font-heading font-bold text-sm uppercase tracking-wider hover:text-accent-pink transition-colors"
                >
                  Physiotherapy in {area.name}
                </Link>
                <ul className="mt-3 space-y-1.5">
                  {area.subAreas.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/service-areas/${area.slug}/${sub.slug}`}
                        className="text-slate-400 text-xs hover:text-accent-pink transition-colors"
                      >
                        Physiotherapy in {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Width GBP Map Row */}
      <div className="border-t border-slate-800">
        <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
          <iframe
            src="https://www.google.com/maps?q=PhysioSthanak+Borivali+West+Mumbai&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'grayscale(0.3) brightness(0.85)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="PhysioSthanak - Google Business Profile"
          />
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500">
            <p>&copy; {currentYear} {siteConfig.businessName}. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-slate-600">
                Created by{' '}
                <span className="text-slate-400 hover:text-accent-pink transition-colors">
                  Karan Sangoi
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
