import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for PhysioSthanak. Read our terms regarding physiotherapy services, appointments, cancellations, payments, and liability.',
  alternates: {
    canonical: `${siteConfig.domain}/terms`,
  },
  openGraph: {
    title: 'Terms of Service | PhysioSthanak',
    description:
      'Terms of Service for PhysioSthanak. Read our terms regarding physiotherapy services, appointments, cancellations, payments, and liability.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/terms`,
    siteName: siteConfig.businessName,
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      {/* Header */}
      <section className="section-padding bg-primary text-white">
        <div className="container-max">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold uppercase tracking-wide">
            Terms of Service
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl">
            Please read these terms carefully before using our physiotherapy services or
            website.
          </p>
          <p className="mt-2 text-white/60 text-sm">
            Last updated: 25 March 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="space-y-10">
            {/* Acceptance of Terms */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                By accessing the PhysioSthanak website at{' '}
                <Link href="/" className="text-primary underline hover:text-primary-dark">
                  {siteConfig.domain}
                </Link>
                , booking an appointment, or using any of our physiotherapy services, you
                agree to be bound by these Terms of Service. If you do not agree with any
                part of these terms, please do not use our services or website.
              </p>
              <p className="text-text-light leading-relaxed">
                PhysioSthanak is a physiotherapy clinic operated by{' '}
                {siteConfig.doctorName}, located at {siteConfig.address}.
              </p>
            </div>

            {/* Services Provided */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                2. Services Provided
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                PhysioSthanak provides professional physiotherapy and rehabilitation
                services, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-1 mb-4 ml-4">
                <li>Orthopaedic and musculoskeletal physiotherapy</li>
                <li>Sports injury rehabilitation</li>
                <li>Neurological rehabilitation</li>
                <li>Post-surgical rehabilitation</li>
                <li>Geriatric physiotherapy</li>
                <li>Pain management (back pain, neck pain, joint pain)</li>
                <li>Home visit physiotherapy</li>
                <li>Preventive physiotherapy and ergonomic assessment</li>
              </ul>
              <p className="text-text-light leading-relaxed">
                All services are provided by qualified and registered physiotherapy
                professionals. Treatment plans are tailored to each patient&apos;s
                individual condition and needs.
              </p>
            </div>

            {/* Medical Disclaimer */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                3. Medical Disclaimer
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                <strong>Important:</strong> The information provided on our website is for
                general educational and informational purposes only. It is not intended as
                a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  Always seek the advice of your physician or other qualified healthcare
                  provider before starting any physiotherapy treatment
                </li>
                <li>
                  Never disregard professional medical advice or delay seeking treatment
                  because of information found on our website
                </li>
                <li>
                  Physiotherapy outcomes vary from patient to patient; we do not guarantee
                  specific treatment results
                </li>
                <li>
                  Any testimonials or reviews displayed on our website represent
                  individual patient experiences and should not be taken as a guarantee of
                  similar outcomes
                </li>
                <li>
                  In case of a medical emergency, contact your nearest hospital or call
                  emergency services immediately
                </li>
              </ul>
            </div>

            {/* Appointment Booking */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                4. Appointment Booking
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                Appointments can be booked through the following channels:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-1 mb-4 ml-4">
                <li>Online through our website booking form (powered by Google Calendar)</li>
                <li>By calling us at {siteConfig.phone}</li>
                <li>Via email at {siteConfig.email}</li>
                <li>In person at our clinic</li>
              </ul>
              <p className="text-text-light leading-relaxed mb-3">
                By booking an appointment, you confirm that:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                <li>
                  The personal and medical information you provide is accurate and complete
                </li>
                <li>
                  You will inform us of any changes to your health condition before or
                  during treatment
                </li>
                <li>
                  You consent to the physiotherapy assessment and treatment procedures
                  discussed with your therapist
                </li>
              </ul>
            </div>

            {/* Cancellation and Rescheduling */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                5. Cancellation and Rescheduling Policy
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                We understand that plans can change. To ensure fair access for all
                patients, we request the following:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  <strong>Cancellations:</strong> Please inform us at least 4 hours before
                  your scheduled appointment. Cancellations can be made by phone or email.
                </li>
                <li>
                  <strong>Rescheduling:</strong> Appointments can be rescheduled at no
                  additional cost with a minimum of 4 hours&apos; notice.
                </li>
                <li>
                  <strong>Late arrivals:</strong> If you arrive more than 15 minutes late,
                  your session may be shortened to accommodate subsequent patients, or it
                  may need to be rescheduled.
                </li>
                <li>
                  <strong>No-shows:</strong> Repeated no-shows without prior notice may
                  result in a requirement to prepay for future appointments.
                </li>
              </ul>
              <p className="text-text-light leading-relaxed mt-3">
                We reserve the right to cancel or reschedule appointments due to
                unforeseen circumstances, in which case we will notify you as soon as
                possible and offer an alternative time.
              </p>
            </div>

            {/* Payment Terms */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                6. Payment Terms
              </h2>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  Consultation and treatment fees are communicated at the time of booking
                  or during your first visit
                </li>
                <li>
                  Payment is due at the time of service unless a payment package has been
                  arranged in advance
                </li>
                <li>
                  We accept payment via cash, UPI, bank transfer, and major debit/credit
                  cards
                </li>
                <li>
                  Package pricing (multiple sessions) is available for ongoing treatment
                  plans and is communicated on a case-by-case basis
                </li>
                <li>
                  Receipts will be provided for all payments made
                </li>
                <li>
                  If you have health insurance that covers physiotherapy, we can provide
                  the necessary documentation for your claim; however, we do not
                  process insurance claims directly
                </li>
              </ul>
            </div>

            {/* Refund Policy */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                7. Refund Policy
              </h2>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  Individual sessions that have been completed are non-refundable
                </li>
                <li>
                  For prepaid treatment packages, refunds for unused sessions may be
                  considered on a case-by-case basis, subject to a reasonable
                  administrative charge
                </li>
                <li>
                  Refund requests must be made in writing to {siteConfig.email}
                </li>
              </ul>
            </div>

            {/* Patient Responsibilities */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                8. Patient Responsibilities
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                To ensure the best treatment outcomes, patients are expected to:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  Provide accurate and complete medical history and inform us of any
                  changes
                </li>
                <li>
                  Follow prescribed home exercise programmes and treatment
                  recommendations
                </li>
                <li>
                  Inform the therapist immediately of any discomfort, pain, or adverse
                  reactions during treatment
                </li>
                <li>
                  Arrive on time for scheduled appointments
                </li>
                <li>
                  Disclose all current medications, supplements, and other treatments
                  being received
                </li>
                <li>
                  Treat clinic staff with courtesy and respect
                </li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                To the fullest extent permitted by applicable Indian law:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  PhysioSthanak shall not be liable for any indirect, incidental, or
                  consequential damages arising from the use of our services or website
                </li>
                <li>
                  We provide our services with reasonable skill and care, but we do not
                  guarantee specific treatment outcomes
                </li>
                <li>
                  Our total liability for any claim arising from our services shall not
                  exceed the amount paid by you for the specific treatment in question
                </li>
                <li>
                  We are not liable for any loss or damage resulting from factors outside
                  our control, including the patient&apos;s failure to follow treatment
                  recommendations
                </li>
              </ul>
            </div>

            {/* Website Use */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                10. Website Use
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                By using our website, you agree to:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  Use the website only for lawful purposes and in accordance with these
                  terms
                </li>
                <li>
                  Not attempt to gain unauthorized access to any part of the website, its
                  servers, or connected systems
                </li>
                <li>
                  Not reproduce, distribute, or create derivative works from our website
                  content without prior written permission
                </li>
              </ul>
              <p className="text-text-light leading-relaxed mt-3">
                All content on the PhysioSthanak website, including text, images, logos,
                and design, is the intellectual property of PhysioSthanak and is protected
                by applicable copyright laws. Unauthorized use is strictly prohibited.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                11. Governing Law and Jurisdiction
              </h2>
              <p className="text-text-light leading-relaxed">
                These Terms of Service are governed by and construed in accordance with
                the laws of India. Any disputes arising from or in connection with these
                terms shall be subject to the exclusive jurisdiction of the courts of
                Mumbai, Maharashtra.
              </p>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                12. Changes to These Terms
              </h2>
              <p className="text-text-light leading-relaxed">
                We reserve the right to update or modify these Terms of Service at any
                time. Changes will be posted on this page with a revised &ldquo;Last
                updated&rdquo; date. Continued use of our services or website after any
                changes constitutes acceptance of the updated terms.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                13. Contact Us
              </h2>
              <p className="text-text-light leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-bg-light rounded-lg p-6 space-y-2">
                <p className="font-heading font-bold text-accent text-lg">
                  {siteConfig.businessName}
                </p>
                <p className="text-text-light text-sm">
                  <strong>Address:</strong> {siteConfig.address}
                </p>
                <p className="text-text-light text-sm">
                  <strong>Phone:</strong>{' '}
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-primary underline hover:text-primary-dark"
                  >
                    {siteConfig.phone}
                  </a>
                </p>
                <p className="text-text-light text-sm">
                  <strong>Email:</strong>{' '}
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-primary underline hover:text-primary-dark"
                  >
                    {siteConfig.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
