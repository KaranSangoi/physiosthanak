'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Plus,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Stethoscope,
  ClipboardList,
  Pencil,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { Patient, PatientAssessment, PatientStatus } from '@/types/patient';

interface EditableForm {
  name: string;
  age: string;
  gender: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  occupation: string;
  occupation_demands: string;
  chief_complaint: string;
  referring_doctor: string;
  treatment_goals: string;
  medical_history: string;
  current_medications: string;
  allergies: string;
  patient_status: PatientStatus;
  notes: string;
}

const formFromPatient = (p: Patient): EditableForm => ({
  name: p.name,
  age: p.age?.toString() ?? '',
  gender: p.gender ?? '',
  contact_phone: p.contact_phone ?? '',
  contact_email: p.contact_email ?? '',
  address: p.address ?? '',
  emergency_contact_name: p.emergency_contact_name ?? '',
  emergency_contact_phone: p.emergency_contact_phone ?? '',
  occupation: p.occupation ?? '',
  occupation_demands: p.occupation_demands ?? '',
  chief_complaint: p.chief_complaint ?? '',
  referring_doctor: p.referring_doctor ?? '',
  treatment_goals: p.treatment_goals ?? '',
  medical_history: p.medical_history ?? '',
  current_medications: p.current_medications ?? '',
  allergies: p.allergies ?? '',
  patient_status: p.patient_status,
  notes: p.notes ?? '',
});

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessments, setAssessments] = useState<PatientAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditableForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

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
        .eq('id', patientId)
        .single(),
      supabase
        .from('patient_assessments')
        .select('*')
        .eq('patient_id', patientId)
        .order('assessment_date', { ascending: false }),
    ]);

    if (patientData) {
      setPatient(patientData as Patient);
      setForm(formFromPatient(patientData as Patient));
    }

    setAssessments((assessData || []) as PatientAssessment[]);
    setLoading(false);
  };

  const startEdit = () => {
    if (patient) {
      setForm(formFromPatient(patient));
      setEditing(true);
    }
  };

  const cancelEdit = () => {
    if (patient) {
      setForm(formFromPatient(patient));
    }
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form || !patient) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setToast({ message: 'Name is required', type: 'error' });
      return;
    }

    const ageParsed = form.age.trim() ? Number(form.age) : null;
    if (form.age.trim() && (Number.isNaN(ageParsed) || (ageParsed ?? 0) < 0 || (ageParsed ?? 0) > 130)) {
      setToast({ message: 'Age must be a valid number', type: 'error' });
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('patients')
      .update({
        name: trimmedName,
        age: ageParsed,
        gender: form.gender || null,
        contact_phone: form.contact_phone.trim() || null,
        contact_email: form.contact_email.trim() || null,
        address: form.address.trim() || null,
        emergency_contact_name: form.emergency_contact_name.trim() || null,
        emergency_contact_phone: form.emergency_contact_phone.trim() || null,
        occupation: form.occupation.trim() || null,
        occupation_demands: form.occupation_demands.trim() || null,
        chief_complaint: form.chief_complaint.trim() || null,
        referring_doctor: form.referring_doctor.trim() || null,
        treatment_goals: form.treatment_goals.trim() || null,
        medical_history: form.medical_history.trim() || null,
        current_medications: form.current_medications.trim() || null,
        allergies: form.allergies.trim() || null,
        patient_status: form.patient_status,
        notes: form.notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', patientId);

    setSaving(false);

    if (error) {
      setToast({ message: 'Failed to update patient', type: 'error' });
      return;
    }

    setToast({ message: 'Patient updated', type: 'success' });
    setEditing(false);
    loadData();
  };

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

  if (!patient || !form) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Patient not found.</p>
        <button
          onClick={() => router.push('/admin/patients')}
          className="text-[#14507c] hover:underline text-sm"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/admin/patients')}
            className="p-2 hover:bg-gray-100 rounded-md shrink-0"
            aria-label="Back to patients"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-gray-800 normal-case truncate">{patient.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5 flex-wrap">
              {patient.age != null && <span>{patient.age} yrs</span>}
              {patient.gender && <span>&middot; {patient.gender}</span>}
              <PatientStatusBadge status={patient.patient_status} />
            </div>
          </div>
        </div>
        {!editing ? (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shrink-0"
          >
            <Pencil size={14} />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={cancelEdit}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X size={14} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {editing && (
        <EditNameStatusCard form={form} setForm={setForm} />
      )}

      {/* Quick Info */}
      <Section title="Contact & Quick Info">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <Field
            icon={<Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Phone"
            value={patient.contact_phone}
            editing={editing}
            inputType="tel"
            formValue={form.contact_phone}
            onChange={(v) => setForm({ ...form, contact_phone: v })}
          />
          <Field
            icon={<Mail size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Email"
            value={patient.contact_email}
            editing={editing}
            inputType="email"
            formValue={form.contact_email}
            onChange={(v) => setForm({ ...form, contact_email: v })}
          />
          <Field
            icon={<Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Age"
            value={patient.age?.toString() ?? null}
            editing={editing}
            inputType="number"
            formValue={form.age}
            onChange={(v) => setForm({ ...form, age: v })}
          />
          <Field
            icon={<User size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Gender"
            value={patient.gender}
            editing={editing}
            renderInput={() => (
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
              >
                <option value="">Select…</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            )}
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <Field
              icon={<MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />}
              label="Address"
              value={patient.address}
              editing={editing}
              inputType="text"
              formValue={form.address}
              onChange={(v) => setForm({ ...form, address: v })}
            />
          </div>
          <Field
            icon={<User size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Emergency Contact"
            value={patient.emergency_contact_name}
            editing={editing}
            inputType="text"
            formValue={form.emergency_contact_name}
            onChange={(v) => setForm({ ...form, emergency_contact_name: v })}
          />
          <Field
            icon={<Phone size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Emergency Phone"
            value={patient.emergency_contact_phone}
            editing={editing}
            inputType="tel"
            formValue={form.emergency_contact_phone}
            onChange={(v) => setForm({ ...form, emergency_contact_phone: v })}
          />
        </div>
      </Section>

      {/* Clinical */}
      <Section title="Clinical">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
          <LongField
            icon={<Stethoscope size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Chief Complaint"
            value={patient.chief_complaint}
            editing={editing}
            formValue={form.chief_complaint}
            onChange={(v) => setForm({ ...form, chief_complaint: v })}
          />
          <Field
            icon={<User size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Referring Doctor"
            value={patient.referring_doctor}
            editing={editing}
            inputType="text"
            formValue={form.referring_doctor}
            onChange={(v) => setForm({ ...form, referring_doctor: v })}
          />
          <LongField
            icon={<ClipboardList size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Treatment Goals"
            value={patient.treatment_goals}
            editing={editing}
            formValue={form.treatment_goals}
            onChange={(v) => setForm({ ...form, treatment_goals: v })}
          />
          <LongField
            icon={<ClipboardList size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Medical History"
            value={patient.medical_history}
            editing={editing}
            formValue={form.medical_history}
            onChange={(v) => setForm({ ...form, medical_history: v })}
          />
          <LongField
            icon={<ClipboardList size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Current Medications"
            value={patient.current_medications}
            editing={editing}
            formValue={form.current_medications}
            onChange={(v) => setForm({ ...form, current_medications: v })}
          />
          <LongField
            icon={<AlertTriangle size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Allergies"
            value={patient.allergies}
            editing={editing}
            formValue={form.allergies}
            onChange={(v) => setForm({ ...form, allergies: v })}
          />
        </div>
      </Section>

      {/* Background */}
      <Section title="Background">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
          <Field
            icon={<Briefcase size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Occupation"
            value={patient.occupation}
            editing={editing}
            inputType="text"
            formValue={form.occupation}
            onChange={(v) => setForm({ ...form, occupation: v })}
          />
          <LongField
            icon={<Briefcase size={16} className="text-gray-400 mt-0.5 shrink-0" />}
            label="Occupation Demands"
            value={patient.occupation_demands}
            editing={editing}
            formValue={form.occupation_demands}
            onChange={(v) => setForm({ ...form, occupation_demands: v })}
          />
        </div>
      </Section>

      {/* Notes */}
      <Section title="Notes">
        <LongField
          icon={<ClipboardList size={16} className="text-gray-400 mt-0.5 shrink-0" />}
          label="Internal Notes"
          value={patient.notes}
          editing={editing}
          formValue={form.notes}
          onChange={(v) => setForm({ ...form, notes: v })}
        />
      </Section>

      {/* Action Buttons */}
      {!editing && (
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/patients/${patientId}/assess`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] transition-colors"
          >
            <Plus size={16} />
            New Assessment
          </Link>
        </div>
      )}

      {/* Past Assessments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Past Assessments</h3>
        </div>

        {assessments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No assessments yet. Start with a new assessment.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {assessments.map((a) => (
              <Link
                key={a.id}
                href={`/admin/patients/${patientId}/assessments/${a.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${a.draft ? 'bg-amber-500' : 'bg-green-500'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          a.draft
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {a.draft ? 'Draft' : 'Completed'}
                      </span>
                      <span className="text-sm text-gray-800 font-medium">
                        {new Date(a.assessment_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {a.assessor && (
                      <p className="text-xs text-gray-500 mt-0.5">Assessed by {a.assessor}</p>
                    )}
                  </div>
                </div>
                <span className="text-gray-400 text-xs shrink-0">View &rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Subcomponents ──────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  editing,
  inputType,
  formValue,
  onChange,
  renderInput,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  editing: boolean;
  inputType?: 'text' | 'email' | 'tel' | 'number';
  formValue?: string;
  onChange?: (v: string) => void;
  renderInput?: () => React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="flex-1 min-w-0">
        <span className="text-gray-500 block">{label}</span>
        {editing ? (
          renderInput ? (
            renderInput()
          ) : (
            <input
              type={inputType || 'text'}
              value={formValue || ''}
              onChange={(e) => onChange?.(e.target.value)}
              className="w-full mt-0.5 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
            />
          )
        ) : (
          <p className="font-medium text-gray-800 break-words">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}

function LongField({
  icon,
  label,
  value,
  editing,
  formValue,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  editing: boolean;
  formValue: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="flex-1 min-w-0">
        <span className="text-gray-500 block">{label}</span>
        {editing ? (
          <textarea
            value={formValue}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full mt-0.5 px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
          />
        ) : (
          <p className="font-medium text-gray-800 whitespace-pre-wrap break-words">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}

function EditNameStatusCard({
  form,
  setForm,
}: {
  form: EditableForm;
  setForm: (f: EditableForm) => void;
}) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            value={form.patient_status}
            onChange={(e) => setForm({ ...form, patient_status: e.target.value as PatientStatus })}
            className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="discharged">Discharged</option>
          </select>
        </div>
      </div>
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
