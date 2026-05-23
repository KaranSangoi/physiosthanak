interface WhatIsSectionProps {
  serviceName: string;
  definition: string;
}

export default function WhatIsSection({ serviceName, definition }: WhatIsSectionProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-max max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-accent mb-4">
          What is {serviceName}?
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed" data-speakable="true">
          {definition}
        </p>
      </div>
    </section>
  );
}
