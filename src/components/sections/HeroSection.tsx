import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

interface HeroSectionProps {
  h1: string;
  description: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  backgroundImage?: string;
  showForm?: boolean;
}

export default function HeroSection({
  h1,
  description,
  breadcrumbs,
  backgroundImage,
  showForm = false,
}: HeroSectionProps) {
  return (
    <section className="relative py-12">
      {/* Breadcrumbs */}
      <div className="container-max px-4 mb-8">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Content */}
      <div className="relative overflow-hidden">
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              className="object-cover opacity-10"
              priority
            />
          </div>
        )}

        <div className="container-max px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-accent leading-tight">
                {h1}
              </h1>
              <p className="text-lg text-text-light leading-relaxed max-w-xl">
                {description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1q9Iju5qCiKCskcNXk9tY-7JAD4HANfuNpFPigzU3-4cK6KcZQfLfFbV5NdWNwx6KhQ1jlCZNQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center"
                >
                  Book Appointment
                </a>
                <a
                  href="tel:+919324254297"
                  className="btn-outline text-center"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Form Card (Optional) */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-lg p-8 border border-border-light">
                <h3 className="text-2xl font-bold text-accent mb-6">
                  Get Your Free Consultation
                </h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full btn-primary"
                  >
                    Book Free Consultation
                  </button>
                </form>
                <p className="text-xs text-text-light text-center mt-4">
                  We&apos;ll respond within 2 hours
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
