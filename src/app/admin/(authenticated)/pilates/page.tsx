'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import type { PilatesBatch, PilatesRegistration } from '@/types/pilates';

interface Stats {
  totalRegistrations: number;
  weekRegistrations: number;
  activeBatches: number;
  waitlistedCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalRegistrations: 0,
    weekRegistrations: 0,
    activeBatches: 0,
    waitlistedCount: 0,
  });
  const [batches, setBatches] = useState<PilatesBatch[]>([]);
  const [recentRegistrations, setRecentRegistrations] = useState<(PilatesRegistration & { batch_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const supabase = createClient();

    // Load all data in parallel
    const [
      { count: totalCount },
      { count: weekCount },
      { data: activeBatchesData },
      { count: waitlistedCount },
      { data: batchesData },
      { data: recentData },
    ] = await Promise.all([
      supabase.from('pilates_registrations').select('*', { count: 'exact', head: true }),
      supabase.from('pilates_registrations').select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('pilates_batches').select('*').eq('is_active', true),
      supabase.from('pilates_registrations').select('*', { count: 'exact', head: true })
        .eq('status', 'waitlisted'),
      supabase.from('pilates_batches').select('*').order('created_at', { ascending: false }),
      supabase.from('pilates_registrations').select('*, pilates_batches(name)')
        .order('created_at', { ascending: false }).limit(10),
    ]);

    setStats({
      totalRegistrations: totalCount || 0,
      weekRegistrations: weekCount || 0,
      activeBatches: activeBatchesData?.length || 0,
      waitlistedCount: waitlistedCount || 0,
    });

    setBatches(batchesData || []);

    // Map batch name from join
    const mapped = (recentData || []).map((r: Record<string, unknown>) => ({
      ...r,
      batch_name: (r.pilates_batches as { name: string } | null)?.name || 'Unassigned',
    })) as (PilatesRegistration & { batch_name?: string })[];
    setRecentRegistrations(mapped);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const STAT_CARDS = [
    { label: 'Total Registrations', value: stats.totalRegistrations, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'This Week', value: stats.weekRegistrations, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Active Batches', value: stats.activeBatches, icon: Calendar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Waitlisted', value: stats.waitlistedCount, icon: Clock, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 normal-case">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch Capacity Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Batch Capacity</h3>
        {batches.length === 0 ? (
          <p className="text-sm text-gray-500">No batches created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.filter(b => b.is_active).map((batch) => {
              const fillPct = batch.capacity > 0
                ? Math.round((batch.current_count / batch.capacity) * 100)
                : 0;
              const barColor = fillPct >= 90 ? 'bg-red-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-green-500';

              return (
                <div key={batch.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-800">{batch.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      batch.type === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {batch.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {batch.days} &middot; {batch.time}
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                    <div
                      className={`h-2 rounded-full ${barColor} transition-all`}
                      style={{ width: `${Math.min(fillPct, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {batch.current_count}/{batch.capacity} ({fillPct}%)
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Registrations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Registrations</h3>
        {recentRegistrations.length === 0 ? (
          <p className="text-sm text-gray-500">No registrations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Name</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Phone</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Batch</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-800">{reg.name}</td>
                    <td className="py-2 px-3 text-gray-600">{reg.phone}</td>
                    <td className="py-2 px-3 text-gray-600">{reg.batch_name}</td>
                    <td className="py-2 px-3">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="py-2 px-3 text-gray-500">
                      {new Date(reg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    registered: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-green-100 text-green-700',
    waitlisted: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}
