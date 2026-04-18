'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Search, ChevronDown, Plus, X } from 'lucide-react';
import type { Patient, PatientStatus } from '@/types/patient';

type PatientRow = Patient & {
  last_visit: string | null;
};

interface PatientForm {
  name: string;
  age: string;
  gender: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  occupation: string;
  chief_complaint: string;
  referring_doctor: string;
  patient_status: PatientStatus;
  notes: string;
}

const EMPTY_FORM: PatientForm = {
  name: '',
  age: '',
  gender: '',
  contact_phone: '',
  contact_email: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  occupation: '',
  chief_complaint: '',
  referring_doctor: '',
  patient_status: 'active',
  notes: '',
};

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PatientStatus>('all');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<PatientForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const loadData = async () => {
    const supabase = createClient();

    const [{ data: patientData }, { data: assessData }] = await Promise.all([
      supabase
        .from('patients')
        .select('*')
        .order('name'),
      supabase
        .from('patient_assessments')
        .select('patient_id, assessment_date'),
    ]);

    // Latest assessment date per patient
    const latestMap: Record<string, string> = {};
    (assessData || []).forEach((a: { patient_id: string; assessment_date: string }) => {
      const existing = latestMap[a.patient_id];
      if (!existing || a.assessment_date > existing) {
        latestMap[a.patient_id] = a.assessment_date;
      }
    });

    const mapped = (patientData || []).map((p: Patient) => ({
      ...p,
      last_visit: latestMap[p.id] || null,
    })) as PatientRow[];

    setPatients(mapped);
    setLoading(false);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setToast({ message: 'Name is required', type: 'error' });
      setSaving(false);
      return;
    }

    const ageParsed = form.age.trim() ? Number(form.age) : null;
    if (form.age.trim() && (Number.isNaN(ageParsed) || (ageParsed ?? 0) < 0 || (ageParsed ?? 0) > 130)) {
      setToast({ message: 'Age must be a valid number', type: 'error' });
      setSaving(false);
      return;
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('patients')
      .insert({
        name: trimmedName,
        age: ageParsed,
        gender: form.gender || null,
        contact_phone: form.contact_phone.trim() || null,
        contact_email: form.contact_email.trim() || null,
        address: form.address.trim() || null,
        emergency_contact_name: form.emergency_contact_name.trim() || null,
        emergency_contact_phone: form.emergency_contact_phone.trim() || null,
        occupation: form.occupation.trim() || null,
        chief_complaint: form.chief_complaint.trim() || null,
        referring_doctor: form.referring_doctor.trim() || null,
        patient_status: form.patient_status,
        notes: form.notes.trim() || null,
      })
      .select('id')
      .single();

    setSaving(false);

    if (error) {
      setToast({ message: 'Failed to create patient', type: 'error' });
      return;
    }

    setToast({ message: 'Patient created', type: 'success' });
    setShowModal(false);

    if (data?.id) {
      router.push(`/admin/patients/${data.id}`);
    } else {
      loadData();
    }
  };

  const filtered = patients.filter((p) => {
    if (statusFilter !== 'all' && p.patient_status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.contact_phone || '').toLowerCase().includes(q) ||
        (p.contact_email || '').toLowerCase().includes(q)
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
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-md text-sm font-medium shadow-lg ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 normal-case">Patients</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors"
        >
          <Plus size={16} />
          Add New Patient
        </button>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | PatientStatus)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="discharged">Discharged</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            {patients.length === 0
              ? 'No patients yet — add your first patient to get started.'
              : 'No patients match the current filters.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Age / Gender</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Chief Complaint</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Last Visit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => router.push(`/admin/patients/${p.id}`)}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">
                    {p.age ?? '—'}
                    {p.gender ? ` / ${p.gender}` : ''}
                  </td>
                  <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                    {p.chief_complaint
                      ? p.chief_complaint.length > 40
                        ? `${p.chief_complaint.slice(0, 40)}…`
                        : p.chief_complaint
                      : '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{p.contact_phone || '—'}</td>
                  <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">
                    {p.last_visit
                      ? new Date(p.last_visit).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <PatientStatusBadge status={p.patient_status} />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/patients/${p.id}`);
                      }}
                      className="text-xs text-[#14507c] hover:underline"
                    >
                      View &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-sm text-gray-500">
        Showing {filtered.length} of {patients.length} patients
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Add New Patient</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                    placeholder="Patient full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    min={0}
                    max={130}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white"
                  >
                    <option value="">Select…</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.contact_phone}
                    onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                    placeholder="+91…"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={form.emergency_contact_name}
                    onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={form.emergency_contact_phone}
                    onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={form.occupation}
                    onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referring Doctor</label>
                  <input
                    type="text"
                    value={form.referring_doctor}
                    onChange={(e) => setForm({ ...form, referring_doctor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
                  <textarea
                    value={form.chief_complaint}
                    onChange={(e) => setForm({ ...form, chief_complaint: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
                    placeholder="Primary reason for visit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.patient_status}
                    onChange={(e) => setForm({ ...form, patient_status: e.target.value as PatientStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="on_hold">On Hold</option>
                    <option value="discharged">Discharged</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating…' : 'Create Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PatientStatusBadge({ status }: { status: PatientStatus }) {
  const styles: Record<PatientStatus, string> = {
    active: 'bg-green-100 text-green-700',
    on_hold: 'bg-gray-100 text-gray-600',
    discharged: 'bg-slate-200 text-slate-700',
  };
  const labels: Record<PatientStatus, string> = {
    active: 'Active',
    on_hold: 'On Hold',
    discharged: 'Discharged',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
