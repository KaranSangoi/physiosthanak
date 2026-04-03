'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronDown, ClipboardList } from 'lucide-react';
import type { PilatesBatch, PilatesRegistration } from '@/types/pilates';

type StudentRow = PilatesRegistration & {
  batch_name: string;
  batch_type: string;
  assessment_count: number;
};

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [batches, setBatches] = useState<PilatesBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();

    const [{ data: regData }, { data: batchData }, { data: assessData }] = await Promise.all([
      supabase
        .from('pilates_registrations')
        .select('*, pilates_batches(name, type)')
        .in('status', ['registered', 'confirmed'])
        .order('name'),
      supabase.from('pilates_batches').select('*').order('name'),
      supabase
        .from('pilates_assessments')
        .select('student_id'),
    ]);

    // Count assessments per student
    const countMap: Record<string, number> = {};
    (assessData || []).forEach((a: { student_id: string }) => {
      countMap[a.student_id] = (countMap[a.student_id] || 0) + 1;
    });

    const mapped = (regData || []).map((r: Record<string, unknown>) => {
      const batch = r.pilates_batches as { name: string; type: string } | null;
      return {
        ...r,
        batch_name: batch?.name || 'Unassigned',
        batch_type: batch?.type || '-',
        assessment_count: countMap[r.id as string] || 0,
      };
    }) as StudentRow[];

    setStudents(mapped);
    setBatches(batchData || []);
    setLoading(false);
  };

  const filtered = students.filter((s) => {
    if (batchFilter !== 'all' && s.batch_id !== batchFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 normal-case">Students</h2>
        <span className="text-sm text-gray-500">{students.length} active students</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white"
            >
              <option value="all">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            {students.length === 0
              ? 'No active students yet. Students appear here once registered or confirmed.'
              : 'No students match the current filters.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Batch</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 text-center">Assessments</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => router.push(`/admin/pilates/students/${s.id}`)}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{s.name}</td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{s.phone}</td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{s.email}</td>
                  <td className="py-3 px-4 text-gray-600">{s.batch_name}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      s.batch_type === 'online'
                        ? 'bg-purple-100 text-purple-700'
                        : s.batch_type === 'offline'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {s.batch_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <ClipboardList size={14} className="text-gray-400" />
                      <span className={s.assessment_count > 0 ? 'text-green-700 font-medium' : 'text-gray-400'}>
                        {s.assessment_count}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Showing {filtered.length} of {students.length} students
      </div>
    </div>
  );
}
