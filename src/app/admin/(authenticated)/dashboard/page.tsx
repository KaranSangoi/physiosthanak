import Link from 'next/link';
import {
  UserCheck,
  Users,
  Calendar,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import type { Patient } from '@/types/patient';
import type { PilatesBatch } from '@/types/pilates';

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
});

/** "2 days ago" / "today" / "yesterday" / fallback to short date */
function relativeDate(iso: string): string {
  try {
    const then = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return dateFmt.format(then);
  } catch {
    return '';
  }
}

function truncate(s: string | null, n: number): string {
  if (!s) return '';
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

function todayISODate(): string {
  // YYYY-MM-DD in local time
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function isoDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ──────────────────────────────────────────────────────────────
// Data fetching (each query isolated so a single failure
// doesn't crash the whole page)
// ──────────────────────────────────────────────────────────────

type DashboardData = {
  todaysAssessments: number;
  activePatients: number;
  activePilatesMembers: number;
  pendingFollowUps: number;
  recentPatients: Patient[];
  activeBatches: PilatesBatch[];
};

async function loadDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const today = todayISODate();
  const sevenDaysOut = isoDateOffset(7);

  // Run all queries in parallel; settle individually so one failure
  // doesn't bring down the whole page.
  const results = await Promise.allSettled([
    // 1. Today's patient assessments (count)
    supabase
      .from('patient_assessments')
      .select('*', { count: 'exact', head: true })
      .eq('assessment_date', today),

    // 2. Active patients (count)
    supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('patient_status', 'active'),

    // 3. Pilates active members
    //    Existing convention (see pilates/students/page.tsx): an active student
    //    is a `pilates_registrations` row with status IN ('registered','confirmed').
    supabase
      .from('pilates_registrations')
      .select('*', { count: 'exact', head: true })
      .in('status', ['registered', 'confirmed']),

    // 4. Pending follow-ups: assessments with treatment_plan->>'follow_up_date'
    //    in the next 7 days (today .. today+7).
    //    PostgREST/Supabase supports filtering by JSONB text via ->>.
    supabase
      .from('patient_assessments')
      .select('*', { count: 'exact', head: true })
      .gte('treatment_plan->>follow_up_date', today)
      .lte('treatment_plan->>follow_up_date', sevenDaysOut),

    // 5. Recent patients (10 most recent)
    supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10),

    // 6. Active pilates batches
    supabase
      .from('pilates_batches')
      .select('*')
      .eq('is_active', true)
      .order('name'),
  ]);

  const pickCount = (idx: number, label: string): number => {
    const r = results[idx];
    if (r.status === 'rejected') {
      console.error(`[dashboard] ${label} query failed:`, r.reason);
      return 0;
    }
    if (r.value.error) {
      console.error(`[dashboard] ${label} query error:`, r.value.error);
      return 0;
    }
    return r.value.count ?? 0;
  };

  const pickRows = <T,>(idx: number, label: string): T[] => {
    const r = results[idx];
    if (r.status === 'rejected') {
      console.error(`[dashboard] ${label} query failed:`, r.reason);
      return [];
    }
    if (r.value.error) {
      console.error(`[dashboard] ${label} query error:`, r.value.error);
      return [];
    }
    return (r.value.data as T[]) ?? [];
  };

  return {
    todaysAssessments: pickCount(0, "today's assessments"),
    activePatients: pickCount(1, 'active patients'),
    activePilatesMembers: pickCount(2, 'active pilates members'),
    pendingFollowUps: pickCount(3, 'pending follow-ups'),
    recentPatients: pickRows<Patient>(4, 'recent patients'),
    activeBatches: pickRows<PilatesBatch>(5, 'active batches'),
  };
}

// ──────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────

export const metadata = {
  title: 'Dashboard | PhysioSthanak Admin',
};

// Always render fresh on request — admin dashboard data shouldn't be cached.
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await loadDashboardData();

  const STAT_CARDS = [
    {
      label: "Today's Patients",
      value: data.todaysAssessments,
      icon: ClipboardList,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Active Patients',
      value: data.activePatients,
      icon: UserCheck,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Pilates Active Members',
      value: data.activePilatesMembers,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Pending Follow-ups (7d)',
      value: data.pendingFollowUps,
      icon: Calendar,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 normal-case">
          Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Overview of your clinic activity
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 leading-none">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Patients (spans 2 cols on desktop) */}
        <section className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Recent Patients
            </h3>
            <Link
              href="/admin/patients"
              className="text-sm text-[#14507c] hover:text-[#e8899c] font-medium inline-flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {data.recentPatients.length === 0 ? (
            <EmptyState
              icon={UserCheck}
              title="No patients yet"
              hint="Add your first patient to get started."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600 hidden sm:table-cell">
                      Age
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600 hidden md:table-cell">
                      Chief Complaint
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPatients.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer"
                    >
                      <td className="py-2 px-3">
                        <Link
                          href={`/admin/patients/${p.id}`}
                          className="block font-medium text-gray-800 hover:text-[#14507c]"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-2 px-3 text-gray-600 hidden sm:table-cell">
                        {p.age ?? '—'}
                      </td>
                      <td className="py-2 px-3 text-gray-600 hidden md:table-cell">
                        {truncate(p.chief_complaint, 50) || (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                        {relativeDate(p.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Active Pilates Batches */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">
              Active Pilates Batches
            </h3>
            <Link
              href="/admin/pilates"
              className="text-sm text-[#14507c] hover:text-[#e8899c] font-medium inline-flex items-center gap-1"
            >
              Manage <ArrowRight size={14} />
            </Link>
          </div>

          {data.activeBatches.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No active batches"
              hint="Create a batch in the Pilates section to get started."
            />
          ) : (
            <ul className="space-y-3">
              {data.activeBatches.map((b) => {
                const fillPct =
                  b.capacity > 0
                    ? Math.round((b.current_count / b.capacity) * 100)
                    : 0;
                const barColor =
                  fillPct >= 90
                    ? 'bg-red-500'
                    : fillPct >= 70
                      ? 'bg-amber-500'
                      : 'bg-green-500';
                return (
                  <li
                    key={b.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-800 leading-tight">
                        {b.name}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          b.type === 'online'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {b.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {b.days} &middot; {b.time}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                      <div
                        className={`h-1.5 rounded-full ${barColor} transition-all`}
                        style={{ width: `${Math.min(fillPct, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {b.current_count}/{b.capacity}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: typeof UserCheck;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="p-3 rounded-full bg-gray-50 text-gray-400 mb-3">
        <Icon size={24} />
      </div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </div>
  );
}
