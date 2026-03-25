interface MapSectionProps {
  heading: string;
  description: string;
  location: string;
  mapQuery?: string;
}

export default function MapSection({
  heading,
  description,
  location,
  mapQuery,
}: MapSectionProps) {
  const query = mapQuery
    ? encodeURIComponent(mapQuery)
    : 'PhysioSthanak+Borivali+West+Mumbai';

  const mapSrc = `https://www.google.com/maps?q=${query}&output=embed`;

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'PhysioSthanak',
    image: 'https://physiosthanak.com/images/Logo.png',
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.2288',
      longitude: '72.8563',
    },
    areaServed: {
      '@type': 'Place',
      name: location,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <section className="section-padding bg-bg-light">
        <div className="container-max">
          <div className="text-center mb-14">
            <span className="section-eyebrow">Find Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-accent mb-4 uppercase">
              {heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div>
              <p className="text-lg text-text-light leading-relaxed mb-8">
                {description}
              </p>

              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-md border border-border-light">
                  <h3 className="font-bold text-accent mb-3 uppercase font-heading text-base">
                    Clinic Address
                  </h3>
                  <p className="text-text-light leading-relaxed">
                    Shop No. 14, Ground Floor, Hari-Smruti Premises, Sardar
                    Vallabhbhai Patel Rd, opp. HDFC Bank, Borivali West,
                    Mumbai, Maharashtra 400092
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-md border border-border-light">
                  <h3 className="font-bold text-accent mb-3 uppercase font-heading text-base">
                    Get Directions
                  </h3>
                  <a
                    href={`https://maps.google.com/?q=${query}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block btn-primary text-sm"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="w-full h-[280px] sm:h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-xl border border-border-light">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`PhysioSthanak - ${location}`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
