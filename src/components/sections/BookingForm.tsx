'use client';

import { useState } from 'react';
import { siteConfig } from '@/data/site-config';
import { MessageSquare } from 'lucide-react';

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement form submission to server action
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service'),
        message: formData.get('message'),
      };

      // Placeholder: In production, this would call a server action
      console.log('Form submitted:', data);

      setSubmitStatus('success');
      e.currentTarget.reset();

      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
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
            <h2 className="text-2xl font-bold text-accent mb-2">
              Schedule Your Consultation
            </h2>
            <p className="text-text-light mb-6">
              Fill out the form below and we&apos;ll get back to you soon
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-accent mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-accent mb-2"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="+91 9324254297"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-accent mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-accent mb-2"
                >
                  Service of Interest
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">Select a service</option>
                  <option value="pain-management">Pain Management</option>
                  <option value="sports-injuries">Sports Injuries</option>
                  <option value="orthopaedic">Orthopaedic Rehabilitation</option>
                  <option value="neurological">Neurological Conditions</option>
                  <option value="post-operative">Post-Operative Recovery</option>
                  <option value="women-health">Women Health</option>
                  <option value="corporate">Corporate Wellness</option>
                  <option value="senior-care">Senior Care</option>
                  <option value="pediatric">Pediatric Physiotherapy</option>
                  <option value="yoga">Yoga & Wellness</option>
                  <option value="manual-therapy">Manual Therapy</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-accent mb-2"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Tell us about your condition or specific needs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Request Appointment'}
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                  Thank you! We&apos;ll contact you within 2 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  An error occurred. Please try again or call us directly.
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
                <h3 className="font-semibold text-accent">Message on WhatsApp</h3>
                <p className="text-text-light">Get immediate response on WhatsApp</p>
              </div>
            </a>

            {/* Contact Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-accent">Contact Information</h3>

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
                <p className="text-sm text-text-light mb-1">Address</p>
                <p className="text-accent">
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
                    className="inline-block px-4 py-2 bg-bg-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                  >
                    Instagram
                  </a>
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-bg-light text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium"
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
