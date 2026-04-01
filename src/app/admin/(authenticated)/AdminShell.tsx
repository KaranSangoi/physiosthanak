'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const NAV_ITEMS = [
  { href: '/admin/pilates', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pilates/batches', label: 'Batches', icon: Calendar },
  { href: '/admin/pilates/registrations', label: 'Registrations', icon: Users },
  { href: '/admin/pilates/waitlist', label: 'Waitlist', icon: Clock },
  { href: '/admin/pilates/settings', label: 'Settings', icon: Settings },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
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
          <Link href="/admin/pilates" className="font-heading text-lg font-bold tracking-wide uppercase">
            PhysioSthanak
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href === '/admin/analytics' && pathname.startsWith('/admin/analytics'));
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
            Pilates Admin
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
