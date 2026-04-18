'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  ArrowLeft,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const MAIN_NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/patients', label: 'Patients', icon: UserCheck },
  { href: '/admin/pilates', label: 'Pilates', icon: Calendar },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

const PILATES_NAV_ITEMS = [
  { href: '/admin/pilates', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pilates/batches', label: 'Batches', icon: Calendar },
  { href: '/admin/pilates/registrations', label: 'Registrations', icon: Users },
  { href: '/admin/pilates/students', label: 'Students', icon: UserCheck },
  { href: '/admin/pilates/waitlist', label: 'Waitlist', icon: Clock },
  { href: '/admin/pilates/settings', label: 'Settings', icon: Settings },
];

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Defer mode detection until after mount. usePathname() can return values
  // that don't match what the server rendered during the first paint, which
  // makes the conditional Pilates back-button cause a hydration mismatch.
  // Render the main-mode shell first, then swap on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isPilatesMode = mounted && pathname.startsWith('/admin/pilates');
  const navItems = isPilatesMode ? PILATES_NAV_ITEMS : MAIN_NAV_ITEMS;
  const logoHref = isPilatesMode ? '/admin/pilates' : '/admin/dashboard';
  const headerTitle = isPilatesMode ? 'Pilates Admin' : 'PhysioSthanak Admin';

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#14507c] text-white transform transition-transform duration-200
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link href={logoHref}>
            <Image
              src="/images/logo-header.png"
              alt="PhysioSthanak Admin"
              width={406}
              height={130}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {isPilatesMode && (
          <div className="px-3 pt-4 pb-3 border-b border-white/10">
            <Link
              href="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="group flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium bg-[#e8899c]/15 text-[#f5b8c5] border border-[#e8899c]/30 hover:bg-[#e8899c]/25 hover:text-white hover:border-[#e8899c]/60 transition-all"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Main
            </Link>
          </div>
        )}

        <nav className="mt-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/pilates' &&
                item.href !== '/admin/dashboard' &&
                pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${isActive ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="text-xs text-white/50 mb-2 truncate">{user.email}</div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors w-full"
          >
            <LogOut size={16} />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800 font-heading normal-case">
            {headerTitle}
          </h1>
          <div className="text-sm text-gray-500 hidden sm:block">
            {user.email}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
