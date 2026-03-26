'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/data/site-config';
import { Menu, X } from 'lucide-react';

const serviceCategories = [
  { name: 'Physiotherapy', href: '/services/physiotherapy' },
  { name: 'Home Visit Physiotherapy', href: '/services/home-visit-physiotherapy' },
  { name: 'Sports Physiotherapy', href: '/services/sports-physiotherapy' },
  { name: 'Back Pain', href: '/services/back-pain-physiotherapy' },
  { name: 'Neck Pain', href: '/services/neck-pain-physiotherapy' },
  { name: 'Neurological', href: '/services/neurological-physiotherapy' },
  { name: 'Orthopedic', href: '/services/orthopedic-physiotherapy' },
  { name: 'Post-Surgery Rehab', href: '/services/post-surgery-rehabilitation' },
  { name: 'Pediatric', href: '/services/pediatric-physiotherapy' },
  { name: 'Women\'s Health', href: '/services/womens-health-physiotherapy' },
  { name: 'Hand & Wrist', href: '/services/hand-physiotherapy' },
];

const serviceAreas = [
  { name: 'Borivali', href: '/service-areas/borivali' },
  { name: 'Dahisar', href: '/service-areas/dahisar' },
  { name: 'Kandivali', href: '/service-areas/kandivali' },
  { name: 'Malad', href: '/service-areas/malad' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [areasDropdownOpen, setAreasDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="container-max px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <Image
              src="/images/logo-header.png"
              alt="PhysioSthanak - Move · Heal · Improve"
              width={406}
              height={130}
              className="h-12 sm:h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="font-heading uppercase tracking-wide text-text-dark hover:text-primary font-bold text-sm transition-colors"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <Link
                href="/services"
                className="font-heading uppercase tracking-wide text-text-dark hover:text-primary font-bold text-sm flex items-center gap-1 transition-colors"
              >
                Services
                <svg className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute left-0 mt-2 w-60 bg-white border border-border-light rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {serviceCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="block px-4 py-2.5 text-sm text-text-dark hover:bg-bg-light hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Service Areas Dropdown */}
            <div className="relative group">
              <Link
                href="/service-areas"
                className="font-heading uppercase tracking-wide text-text-dark hover:text-primary font-bold text-sm flex items-center gap-1 transition-colors"
              >
                Service Areas
                <svg className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-border-light rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {serviceAreas.map((area) => (
                  <Link
                    key={area.href}
                    href={area.href}
                    className="block px-4 py-2.5 text-sm text-text-dark hover:bg-bg-light hover:text-primary transition-colors"
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="font-heading uppercase tracking-wide text-text-dark hover:text-primary font-bold text-sm transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button and Mobile Menu */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="hidden sm:inline-block btn-primary text-sm"
            >
              {siteConfig.phone}
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-bg-light transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t border-border-light space-y-1">
            <Link
              href="/"
              className="block px-3 py-2.5 text-text-dark hover:bg-bg-light hover:text-primary rounded-md transition-colors font-heading font-bold uppercase tracking-wide text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Services Dropdown */}
            <div>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className="w-full text-left px-3 py-2.5 text-text-dark hover:bg-bg-light hover:text-primary rounded-md transition-colors font-heading font-bold uppercase tracking-wide text-sm flex items-center justify-between"
              >
                Services
                <svg className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesDropdownOpen && (
                <div className="pl-4 space-y-1">
                  {serviceCategories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="block px-3 py-2 text-sm text-text-dark hover:bg-bg-light hover:text-primary rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Service Areas Dropdown */}
            <div>
              <button
                onClick={() => setAreasDropdownOpen(!areasDropdownOpen)}
                className="w-full text-left px-3 py-2.5 text-text-dark hover:bg-bg-light hover:text-primary rounded-md transition-colors font-heading font-bold uppercase tracking-wide text-sm flex items-center justify-between"
              >
                Service Areas
                <svg className={`w-4 h-4 transition-transform ${areasDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {areasDropdownOpen && (
                <div className="pl-4 space-y-1">
                  {serviceAreas.map((area) => (
                    <Link
                      key={area.href}
                      href={area.href}
                      className="block px-3 py-2 text-sm text-text-dark hover:bg-bg-light hover:text-primary rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {area.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="block px-3 py-2.5 text-text-dark hover:bg-bg-light hover:text-primary rounded-md transition-colors font-heading font-bold uppercase tracking-wide text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <a
              href={`tel:${siteConfig.phone}`}
              className="block sm:hidden px-3 py-3 mt-4 text-center btn-primary text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {siteConfig.phone}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
