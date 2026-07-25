const BOOKING_URL = 'https://wa.me/919324254297?text=Hi%20PhysioSthanak%2C%20I%20would%20like%20to%20book%20my%20FREE%20first%20consultation';

// Mobile-only sticky action bar — most ad traffic is mobile, and a
// thumb-reachable Call/Book bar removes the biggest conversion friction.
export default function StickyCallBar() {
  return (
    <>
      {/* Spacer so the fixed bar never covers footer content on mobile */}
      <div className="h-14 md:hidden" aria-hidden="true" />
      <div className="fixed bottom-0 inset-x-0 z-50 grid grid-cols-2 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
        <a
          href="tel:+919324254297"
          className="flex items-center justify-center gap-2 bg-[#14507c] text-white py-3.5 font-heading font-bold uppercase tracking-wide text-sm"
        >
          📞 Call Now
        </a>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-accent-pink text-white py-3.5 font-heading font-bold uppercase tracking-wide text-sm"
        >
          📅 Book Now
        </a>
      </div>
    </>
  );
}
