'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Plus,
  ClipboardList,
  Calendar,
  User,
  Phone,
  Mail,
  Activity,
} from 'lucide-react';
import type { PilatesRegistration, PilatesAssessment } from '@/types/pilates';

type RegistrationWithBatch = PilatesRegistration & {
  batch_name: string;
  batch_type: string;
};

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<RegistrationWithBatch | null>(null);
  const [assessments, setAssessments] = useState<PilatesAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    const supabase = createClient();

    const [{ data: regData }, { data: assessData }] = await Promise.all([
      supabase
        .from('pilates_registrations')
        .select('*, pilates_batches(name, type)')
        .eq('id', studentId)
        .single(),
      supabase
        .from('pilates_assessments')
        .select('*')
        .eq('student_id', studentId)
        .order('assessment_date', { ascending: false }),
    ]);

    if (regData) {
      const batch = (regData as Record<string, unknown>).pilates_batches as { name: string; type: string } | null;
      setStudent({
        ...regData,
        batch_name: batch?.name || 'Unassigned',
        batch_type: batch?.type || '-',
      } as RegistrationWithBatch);
    }

    setAssessments((assessData || []) as PilatesAssessment[]);
    setLoading(false);
  };

  const hasInitial = assessments.some((a) => a.type === 'initial');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-40 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Student not found.</p>
        <button
          onClick={() => router.push('/admin/pilates/students')}
          className="text-[#14507c] hover:underline text-sm"
        >
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/pilates/students')}
          className="p-2 hover:bg-gray-100 rounded-md"
          aria-label="Back to students"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 normal-case">{student.name}</h2>
          <p className="text-sm text-gray-500 capitalize">{student.status} &middot; {student.preference}</p>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Student Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block">Name</span>
              <p className="font-medium text-gray-800">{student.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block">Phone</span>
              <p className="font-medium text-gray-800">{student.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block">Email</span>
              <p className="font-medium text-gray-800">{student.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block">Age</span>
              <p className="font-medium text-gray-800">{student.age || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Activity size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block">Batch</span>
              <p className="font-medium text-gray-800">{student.batch_name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClipboardList size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block">Preference</span>
              <p className="font-medium text-gray-800 capitalize">{student.preference}</p>
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-3 flex items-start gap-3">
            <Activity size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-gray-500 block">Medical History</span>
              <p className="font-medium text-gray-800">{student.medical_history || 'None reported'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {!hasInitial ? (
          <Link
            href={`/admin/pilates/students/${studentId}/assess`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors"
          >
            <Plus size={16} />
            New Initial Assessment
          </Link>
        ) : (
          <Link
            href={`/admin/pilates/students/${studentId}/progress`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors"
          >
            <Plus size={16} />
            New Progress Assessment
          </Link>
        )}
      </div>

      {/* Assessment History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Assessment History</h3>
        </div>

        {assessments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No assessments yet. Start with an initial assessment.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {assessments.map((a) => (
              <Link
                key={a.id}
                href={`/admin/pilates/students/${studentId}/assessments/${a.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    a.type === 'initial' ? 'bg-blue-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        a.type === 'initial'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {a.type === 'initial' ? 'Initial' : 'Progress'}
                      </span>
                      <span className="text-sm text-gray-800 font-medium">
                        {new Date(a.assessment_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Assessed by {a.assessor_name}
                      {a.session_number ? ` | Session #${a.session_number}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">View &rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
