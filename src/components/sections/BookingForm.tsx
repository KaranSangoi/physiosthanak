'use client';

import { useState } from 'react';
import { siteConfig } from '@/data/site-config';
import { MessageSquare } from 'lucide-react';

const WEB3FORMS_KEY = '97e35895-6350-4c20-982e-f2fdb1996900';
const BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1q9Iju5qCiKCskcNXk9tY-7JAD4HANfuNpFPigzU3-4cK6KcZQfLfFbV5NdWNwx6KhQ1jlCZNQ';

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          service: formData.get('service'),
          message: formData.get('message'),
          source_page: 'Contact Page',
          subject: 'New Contact Form Submission - PhysioSthanak',
          from_name: 'PhysioSthanak Website',
          botcheck: '',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitStatus('success');
        e.currentTarget.reset();
        // Open Google Calendar booking
        window.open(BOOKING_URL, '_blank');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/919324254297?text=Hi%20PhysioSthanak,%20I%20would%20like%20to%20book%20an%20appointment`;

  return (
    <section className="section-padding bg-bg-lighter">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-heading font-bold text-accent mb-2 uppercase">
              Schedule Your Consultation
            </h2>
            <p className="text-text-light mb-6">
              Fill out the form below and we&apos;ll get back to you within 2 hours
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <input type="text" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-accent mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-accent mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="+91 9324254297"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-accent mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-accent mb-2">
                  Service of Interest
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="">Select a service</option>
                  <option value="physiotherapy">Physiotherapy</option>
                  <option value="home-visit">Home Visit Physiotherapy</option>
                  <option value="sports">Sports Physiotherapy</option>
                  <option value="back-pain">Back Pain & Spine</option>
                  <option value="neck-pain">Neck Pain & Cervical</option>
                  <option value="post-surgery">Post-Surgery Rehabilitation</option>
                  <option value="neurological">Neurological Physiotherapy</option>
                  <option value="orthopedic">Orthopedic Physiotherapy</option>
                  <option value="pediatric">Pediatric Physiotherapy</option>
                  <option value="womens-health">Women&apos;s Health</option>
                  <option value="hand-wrist">Hand & Wrist Physiotherapy</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-accent mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-md border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your condition or specific needs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Request Appointment'}
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                  Thank you! Your request has been sent. Please pick a slot in the booking page that just opened.
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="block mt-2 text-green-700 font-medium underline">
                    Didn&apos;t open? Click here to book →
                  </a>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  Something went wrong. Please call us directly at {siteConfig.phone}.
                </div>
              )}
            </form>
          </div>

          {/* WhatsApp and Contact Info */}
          <div className="space-y-6">
            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <MessageSquare className="w-12 h-12 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-accent uppercase">Message on WhatsApp</h3>
                <p className="text-text-light text-sm">Get immediate response on WhatsApp</p>
              </div>
            </a>

            {/* Contact Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <h3 className="text-xl font-heading font-bold text-accent uppercase">Contact Information</h3>

              <div>
                <p className="text-sm text-text-light mb-1">Phone</p>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-lg font-semibold text-primary hover:text-primary-dark"
                >
                  {siteConfig.phone}
                </a>
              </div>

              <div>
                <p className="text-sm text-text-light mb-1">Email</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  {siteConfig.email}
                </a>
              </div>

              <div>
                <p className="text-sm text-text-light mb-1">Address</p>
                <p className="text-accent text-sm">
                  {siteConfig.address}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-light mb-3">Follow Us</p>
                <div className="flex gap-3">
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-bg-light text-primary rounded-md hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                  >
                    Instagram
                  </a>
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-bg-light text-primary rounded-md hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
