'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';
import { Menu, X } from 'lucide-react';

const serviceCategories = [
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

const serviceAreas = [
  { name: 'Borivali', href: '/service-areas/borivali' },
  { name: 'Malad', href: '/service-areas/malad' },
  { name: 'Dahisar', href: '/service-areas/dahisar' },
  { name: 'Mira Road', href: '/service-areas/mira-road' },
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
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="container-max section-padding py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-accent hover:text-primary transition-colors"
          >
            PhysioSthanak
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-text-dark hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="text-text-dark hover:text-primary transition-colors font-medium flex items-center gap-2">
                Services
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white border border-border-light rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {serviceCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="block px-4 py-3 text-sm text-text-dark hover:bg-bg-light hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-border-light last:border-b-0"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Service Areas Dropdown */}
            <div className="relative group">
              <button className="text-text-dark hover:text-primary transition-colors font-medium flex items-center gap-2">
                Service Areas
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-border-light rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {serviceAreas.map((area) => (
                  <Link
                    key={area.href}
                    href={area.href}
                    className="block px-4 py-3 text-sm text-text-dark hover:bg-bg-light hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-border-light last:border-b-0"
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/about"
              className="text-text-dark hover:text-primary transition-colors font-medium"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-text-dark hover:text-primary transition-colors font-medium"
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
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-bg-light transition-colors"
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
              className="block px-3 py-2 text-text-dark hover:bg-bg-light hover:text-primary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Services Dropdown */}
            <div>
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className="w-full text-left px-3 py-2 text-text-dark hover:bg-bg-light hover:text-primary rounded-lg transition-colors font-medium flex items-center justify-between"
              >
                Services
                <svg className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {servicesDropdownOpen && (
                <div className="pl-4 space-y-1">
                  {serviceCategories.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="block px-3 py-2 text-sm text-text-dark hover:bg-bg-light hover:text-primary rounded-lg transition-colors"
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
                className="w-full text-left px-3 py-2 text-text-dark hover:bg-bg-light hover:text-primary rounded-lg transition-colors font-medium flex items-center justify-between"
              >
                Service Areas
                <svg className={`w-4 h-4 transition-transform ${areasDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {areasDropdownOpen && (
                <div className="pl-4 space-y-1">
                  {serviceAreas.map((area) => (
                    <Link
                      key={area.href}
                      href={area.href}
                      className="block px-3 py-2 text-sm text-text-dark hover:bg-bg-light hover:text-primary rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {area.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="block px-3 py-2 text-text-dark hover:bg-bg-light hover:text-primary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/contact"
              className="block px-3 py-2 text-text-dark hover:bg-bg-light hover:text-primary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <a
              href={`tel:${siteConfig.phone}`}
              className="block sm:hidden px-3 py-2 mt-4 text-center btn-primary text-sm"
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
