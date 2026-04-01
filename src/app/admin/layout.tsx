export const metadata = {
  title: 'PhysioSthanak Admin',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full-screen overlay that covers the public Header/Footer from root layout.
  // This ensures admin pages have their own clean chrome.
  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 overflow-hidden">
      <style>{`body { overflow: hidden !important; }`}</style>
      {children}
    </div>
  );
}
