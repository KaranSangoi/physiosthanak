import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for PhysioSthanak. Learn how we collect, use, and protect your personal and health information.',
  alternates: {
    canonical: `${siteConfig.domain}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy | PhysioSthanak',
    description:
      'Privacy Policy for PhysioSthanak. Learn how we collect, use, and protect your personal and health information.',
    type: 'website',
    locale: 'en_IN',
    url: `${siteConfig.domain}/privacy`,
    siteName: siteConfig.businessName,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Header */}
      <section className="section-padding bg-primary text-white">
        <div className="container-max">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold uppercase tracking-wide">
            Privacy Policy
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl">
            Your privacy is important to us. This policy explains how PhysioSthanak
            collects, uses, and protects your personal information.
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
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                1. Introduction
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                PhysioSthanak (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is a
                physiotherapy clinic operated by {siteConfig.doctorName}, located at{' '}
                {siteConfig.address}. We are committed to protecting the privacy and
                confidentiality of all personal and health-related information entrusted
                to us by our patients and website visitors.
              </p>
              <p className="text-text-light leading-relaxed">
                This Privacy Policy applies to information collected through our website
                at{' '}
                <Link href="/" className="text-primary underline hover:text-primary-dark">
                  {siteConfig.domain}
                </Link>
                , in-clinic interactions, telephone consultations, and any other
                communications with our practice.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-heading font-bold text-accent mb-2">
                2.1 Personal Information
              </h3>
              <p className="text-text-light leading-relaxed mb-3">
                When you book an appointment, contact us, or use our services, we may
                collect the following personal information:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-1 mb-4 ml-4">
                <li>Full name</li>
                <li>Phone number and email address</li>
                <li>Date of birth and gender</li>
                <li>Residential address</li>
                <li>Emergency contact details</li>
              </ul>

              <h3 className="text-lg font-heading font-bold text-accent mb-2">
                2.2 Health and Medical Information
              </h3>
              <p className="text-text-light leading-relaxed mb-3">
                To provide effective physiotherapy treatment, we collect health-related
                information including:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-1 mb-4 ml-4">
                <li>Medical history, current conditions, and symptoms</li>
                <li>Previous injuries, surgeries, and treatment records</li>
                <li>Diagnostic reports (X-rays, MRI, blood work)</li>
                <li>Physician referral letters and prescriptions</li>
                <li>Treatment notes, progress assessments, and exercise plans</li>
                <li>Photographs or videos taken for clinical assessment (with consent)</li>
              </ul>

              <h3 className="text-lg font-heading font-bold text-accent mb-2">
                2.3 Website Usage Data
              </h3>
              <p className="text-text-light leading-relaxed mb-3">
                When you visit our website, we automatically collect certain technical
                information:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                <li>IP address and browser type</li>
                <li>Device type and operating system</li>
                <li>Pages visited, time spent, and navigation patterns</li>
                <li>Referring website URL</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                We use the information collected for the following purposes:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  <strong>Clinical care:</strong> Diagnosing conditions, creating
                  treatment plans, tracking progress, and providing physiotherapy services
                </li>
                <li>
                  <strong>Appointment management:</strong> Scheduling, confirming, and
                  sending reminders for appointments via Google Calendar
                </li>
                <li>
                  <strong>Communication:</strong> Responding to inquiries, sharing
                  exercise instructions, and providing post-treatment guidance
                </li>
                <li>
                  <strong>Legal compliance:</strong> Maintaining records as required by
                  applicable Indian healthcare laws and regulations
                </li>
                <li>
                  <strong>Service improvement:</strong> Analyzing website usage patterns
                  to improve our online presence and patient experience
                </li>
                <li>
                  <strong>Billing and payments:</strong> Processing consultation fees and
                  generating receipts
                </li>
              </ul>
            </div>

            {/* Patient Data Protection */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                4. Patient Data Protection
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                We handle all patient health information with the highest standards of
                confidentiality, in accordance with:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 mb-4 ml-4">
                <li>
                  <strong>The Digital Personal Data Protection Act, 2023 (DPDPA):</strong>{' '}
                  India&apos;s primary data protection legislation governing the processing
                  of personal data
                </li>
                <li>
                  <strong>Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations, 2002:</strong>{' '}
                  Governing medical professionals&apos; duty of confidentiality
                </li>
                <li>
                  <strong>Information Technology Act, 2000:</strong> Provisions relating to
                  the protection of sensitive personal data
                </li>
                <li>
                  <strong>Clinical Establishments Act, 2010:</strong> Standards for
                  maintenance of medical records
                </li>
              </ul>
              <p className="text-text-light leading-relaxed">
                Patient medical records are stored securely and access is restricted to
                authorized clinical staff only. We retain medical records for a minimum
                period of 3 years from the date of last consultation, as recommended
                under applicable regulations, and may retain them longer if clinically
                necessary.
              </p>
            </div>

            {/* Cookies and Tracking */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                Our website uses cookies and similar tracking technologies to enhance your
                browsing experience. These include:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 mb-4 ml-4">
                <li>
                  <strong>Essential cookies:</strong> Required for the website to function
                  properly (e.g., session management)
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Used via Google Analytics to
                  understand how visitors interact with our website, including page views,
                  traffic sources, and user behaviour patterns
                </li>
                <li>
                  <strong>Third-party widgets:</strong> Our Google Reviews widget
                  (Featurable) may set cookies to display review content
                </li>
              </ul>
              <p className="text-text-light leading-relaxed">
                You can control cookie preferences through your browser settings. Disabling
                certain cookies may affect website functionality.
              </p>
            </div>

            {/* Third-Party Services */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                6. Third-Party Services
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                We use the following third-party services in connection with our website
                and practice:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  <strong>Google Analytics:</strong> For website traffic analysis and
                  visitor behaviour insights. Google Analytics collects anonymized usage
                  data. See{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary-dark"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong>Google Calendar:</strong> For appointment scheduling and
                  management. Appointment details (name, contact, appointment time) are
                  processed through Google&apos;s services. See{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary-dark"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong>Google Maps:</strong> For displaying our clinic location. See{' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary-dark"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong>Featurable:</strong> For displaying Google Reviews on our
                  website.
                </li>
                <li>
                  <strong>Vercel:</strong> Our website hosting provider. See{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary-dark"
                  >
                    Vercel&apos;s Privacy Policy
                  </a>
                  .
                </li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                7. Data Sharing and Disclosure
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                We do not sell, rent, or trade your personal or health information to any
                third party. We may share your information only in the following
                circumstances:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  <strong>With your consent:</strong> When you authorize us to share
                  information with your referring physician, insurance provider, or family
                  members
                </li>
                <li>
                  <strong>For clinical coordination:</strong> With other healthcare
                  providers involved in your care, as necessary for treatment continuity
                </li>
                <li>
                  <strong>Legal requirements:</strong> When required by law, court order,
                  or government authority
                </li>
                <li>
                  <strong>Emergency situations:</strong> To protect the vital interests of
                  the patient or another individual
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                8. Data Security
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                We implement appropriate technical and organizational measures to protect
                your personal and health data, including:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                <li>Secure storage of physical medical records in locked cabinets</li>
                <li>Password-protected access to digital records</li>
                <li>SSL/TLS encryption for all data transmitted through our website</li>
                <li>Regular review of data security practices</li>
                <li>Staff training on data protection and patient confidentiality</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                9. Your Rights
              </h2>
              <p className="text-text-light leading-relaxed mb-3">
                Under the Digital Personal Data Protection Act, 2023, you have the
                following rights:
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                <li>
                  <strong>Right to access:</strong> Request a copy of the personal data we
                  hold about you
                </li>
                <li>
                  <strong>Right to correction:</strong> Request correction of inaccurate
                  or incomplete personal data
                </li>
                <li>
                  <strong>Right to erasure:</strong> Request deletion of your personal
                  data, subject to legal retention requirements
                </li>
                <li>
                  <strong>Right to grievance redressal:</strong> Lodge a complaint
                  regarding the handling of your data
                </li>
                <li>
                  <strong>Right to nominate:</strong> Nominate another individual to
                  exercise your rights in case of death or incapacity
                </li>
              </ul>
              <p className="text-text-light leading-relaxed mt-3">
                To exercise any of these rights, please contact us using the details
                provided below.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-text-light leading-relaxed">
                We may treat patients under the age of 18 with the consent of their
                parent or legal guardian. Personal and health information of minors is
                collected and processed only with verifiable parental consent, in
                compliance with the DPDPA provisions for children&apos;s data.
              </p>
            </div>

            {/* Changes to This Policy */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                11. Changes to This Policy
              </h2>
              <p className="text-text-light leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in
                our practices or applicable laws. The updated policy will be posted on
                this page with a revised &ldquo;Last updated&rdquo; date. We encourage
                you to review this page periodically.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-accent uppercase mb-4">
                12. Contact Us
              </h2>
              <p className="text-text-light leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, wish to exercise your
                data rights, or have concerns about how your information is being handled,
                please contact us:
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
