import type { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import BookingForm from '@/components/sections/BookingForm';
import MapSection from '@/components/sections/MapSection';
import { siteConfig } from '@/data';
import { generateBreadcrumbs } from '@/lib/utils';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact PhysioSthanak | Book Physiotherapy Appointment',
  description:
    'Contact PhysioSthanak for physiotherapy consultation in Borivali. Book your appointment, call us, or visit our clinic. Expert care by Dr. Shiva Jain.',
  keywords: [
    'contact',
    'appointment',
    'booking',
    'physiotherapy',
    'Borivali',
    'phone',
    'address',
  ],
  openGraph: {
    title: 'Contact PhysioSthanak | Book Physiotherapy Appointment',
    description:
      'Get in touch with PhysioSthanak for expert physiotherapy services in Borivali. Book now.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/contact`,
    siteName: siteConfig.businessName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact PhysioSthanak',
      },
    ],
  },
  alternates: {
    canonical: `${siteConfig.domain}/contact`,
  },
};

const breadcrumbs = generateBreadcrumbs('/contact');

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection
        h1="Contact PhysioSthanak"
        description="Get in touch with us to book your physiotherapy appointment. We're here to answer your questions and help you start your recovery journey."
        breadcrumbs={breadcrumbs}
        pageName="Contact"
      />

      {/* Contact Information */}
      <section className="section-padding bg-bg-lighter">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <a
              href={`tel:${siteConfig.phone}`}
              className="bg-white rounded-lg p-6 card-shadow text-center block hover:shadow-xl hover:border-primary/20 border border-transparent transition-all cursor-pointer"
            >
              <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-accent mb-2">
                Phone
              </h3>
              <p className="text-primary font-medium">
                {siteConfig.phone}
              </p>
              <p className="text-sm text-text-light mt-2">
                Available Mon-Sat, 9 AM - 6 PM
              </p>
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteConfig.email}`}
              className="bg-white rounded-lg p-6 card-shadow text-center block hover:shadow-xl hover:border-primary/20 border border-transparent transition-all cursor-pointer"
            >
              <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-accent mb-2">
                Email
              </h3>
              <p className="text-primary font-medium text-sm">
                {siteConfig.email}
              </p>
              <p className="text-sm text-text-light mt-2">
                Response within 24 hours
              </p>
            </a>

            {/* Address */}
            <a
              href="https://maps.google.com/?q=PhysioSthanak+Borivali"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 card-shadow text-center block hover:shadow-xl hover:border-primary/20 border border-transparent transition-all cursor-pointer"
            >
              <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-accent mb-2">
                Address
              </h3>
              <p className="text-sm text-text-light">
                Borivali West, Mumbai
              </p>
              <p className="text-primary text-sm font-medium mt-2">
                Get Directions →
              </p>
            </a>

            {/* Hours */}
            <a
              href={siteConfig.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-6 card-shadow text-center block hover:shadow-xl hover:border-primary/20 border border-transparent transition-all cursor-pointer"
            >
              <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-accent mb-2">
                Hours
              </h3>
              <p className="text-sm text-text-light">
                Mon-Sat: 9:00 AM - 6:00 PM
              </p>
              <p className="text-sm text-text-light">
                Sunday: By Appointment
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <BookingForm />

      {/* Map Section */}
      <MapSection
        heading="Visit Our Clinic"
        description={`Located at Shop No. 14, Ground Floor, Hari-Smruti Premises, Sardar Vallabhbhai Patel Rd, opposite HDFC Bank, our clinic is easily accessible with ample parking and convenient public transport.`}
        location="Borivali, Mumbai"
      />

      {/* Google Calendar Booking */}
      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
            Book Online
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto mb-8">
            Use our Google Calendar to check availability and book your
            appointment directly. Quick, easy, and convenient.
          </p>

          <a
            href={siteConfig.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Open Calendar Booking
          </a>
        </div>
      </section>

      {/* Social Links */}
      <section className="section-padding bg-bg-lighter">
        <div className="container-max text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4">
            Follow Us
          </h2>
          <p className="text-lg text-text-light max-w-2xl mx-auto mb-8">
            Connect with us on social media for tips, updates, and health
            information
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
            >
              Follow on Instagram
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect on LinkedIn
            </a>
            <a
              href={`https://wa.me/919324254297`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
