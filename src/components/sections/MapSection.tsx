interface MapSectionProps {
  heading: string;
  description: string;
  location: string; // Google Maps embed URL or location identifier
}

export default function MapSection({
  heading,
  description,
  location,
}: MapSectionProps) {
  // Google Maps embed for Borivali, Mumbai location
  const mapEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.614771934446!2d72.81638!3d19.23068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b0f8f0f0f0f%3A0xf0f0f0f0f0f0f0f!2sBorivali%20West!5e0!3m2!1sen!2sin!4v1234567890';

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'PhysioSthanak',
    image: 'https://physiosthanak.com/logo.png',
    description: description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. 14, Ground Floor, Hari-Smruti Premises, Sardar Vallabhbhai Patel Rd, opp. HDFC Bank',
      addressLocality: 'Borivali West',
      addressRegion: 'Mumbai',
      postalCode: '400092',
      addressCountry: 'IN',
    },
    telephone: '+919324254297',
    url: 'https://physiosthanak.com',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4 text-center">
            {heading}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div>
              <p className="text-lg text-text-light leading-relaxed mb-6">
                {description}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-accent mb-2">
                    Visit Us In Person
                  </h3>
                  <p className="text-text-light">
                    Shop No. 14, Ground Floor, Hari-Smruti Premises, Sardar
                    Vallabhbhai Patel Rd, opp. HDFC Bank, Borivali West,
                    Mumbai, Maharashtra 400092
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-accent mb-2">
                    Get Directions
                  </h3>
                  <a
                    href={`https://maps.google.com/?q=PhysioSthanak+Borivali`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark font-medium underline-accent"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="PhysioSthanak Location"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
