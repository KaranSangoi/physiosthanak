import Link from 'next/link';
import { siteConfig } from '@/data/site-config';
import { MapPin, Phone } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Service Areas', href: '/service-areas' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

const services = [
  { name: 'Pain Management', href: '/services/pain-management' },
  { name: 'Sports Injuries', href: '/services/sports-injuries' },
  { name: 'Orthopaedic Rehabilitation', href: '/services/orthopaedic-rehabilitation' },
  { name: 'Neurological Conditions', href: '/services/neurological-conditions' },
  { name: 'Post-Operative Recovery', href: '/services/post-operative-recovery' },
  { name: 'Women Health', href: '/services/women-health' },
  { name: 'Corporate Wellness', href: '/services/corporate-wellness' },
  { name: 'Senior Care', href: '/services/senior-care' },
  { name: 'Pediatric Physiotherapy', href: '/services/pediatric-physiotherapy' },
  { name: 'Yoga & Wellness', href: '/services/yoga-wellness' },
  { name: 'Manual Therapy', href: '/services/manual-therapy' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent text-white">
      {/* Main Footer Content */}
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-2">PhysioSthanak</h3>
            <p className="text-gray-300 text-sm mb-4">
              {siteConfig.tagline}
            </p>
            <p className="text-gray-300 text-sm">
              Expert physiotherapy services by {siteConfig.doctorName}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {services.slice(0, 6).map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-gray-300 text-sm hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-start gap-3 text-gray-300 text-sm hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{siteConfig.phone}</span>
              </a>
              <div className="flex items-start gap-3 text-gray-300 text-sm">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{siteConfig.address}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-300">
            <p>&copy; {currentYear} {siteConfig.businessName}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
