'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { PilatesRegistration, PilatesBatch, PilatesAssessment, BodyMapMarker } from '@/types/pilates';
import BodyMap from '@/components/admin/BodyMap';

const STEPS = [
  { id: 1, label: 'Client Details' },
  { id: 2, label: 'History & Red Flags' },
  { id: 3, label: 'Lifestyle' },
  { id: 4, label: 'Pain Assessment' },
  { id: 5, label: 'Posture' },
  { id: 6, label: 'ROM & Muscle' },
  { id: 7, label: 'APPI Elements' },
  { id: 8, label: 'Movement' },
  { id: 9, label: 'Impression & Goals' },
  { id: 10, label: 'Programme' },
];

const RED_FLAG_OPTIONS = [
  'Unexplained weight loss',
  'Night pain',
  'Bladder/bowel dysfunction',
  'Cardiac history',
  'Recent surgery',
  'Pregnancy',
  'Neurological symptoms',
  'Cancer history',
  'Other',
];

const PAIN_NATURE_OPTIONS = ['Sharp', 'Dull', 'Burning', 'Aching', 'Shooting', 'Throbbing', 'Stabbing'];

const POSTURE_FINDINGS = [
  'Forward head posture',
  'Rounded shoulders',
  'Thoracic kyphosis',
  'Lumbar lordosis',
  'Scoliosis',
  'Anterior pelvic tilt',
  'Posterior pelvic tilt',
  'Knee valgus',
  'Flat feet',
];

const APPI_ELEMENTS = [
  { key: 'breathing', label: 'Breathing Pattern' },
  { key: 'centering', label: 'Centering / Core Activation' },
  { key: 'ribcage', label: 'Rib Cage Placement' },
  { key: 'shoulder', label: 'Shoulder Organization' },
  { key: 'head_neck', label: 'Head & Neck Placement' },
  { key: 'double_tabletop', label: 'Double Tabletop Hold' },
];

const MOVEMENT_EXERCISES = [
  { key: 'curl_up', label: 'Curl Up' },
  { key: 'roll_up', label: 'Roll Up' },
  { key: 'single_leg_stretch', label: 'Single Leg Stretch' },
  { key: 'swimming', label: 'Swimming' },
  { key: 'bridging', label: 'Bridging' },
  { key: 'plank', label: 'Plank' },
];

const FUNCTIONAL_TESTS = [
  { key: 'sit_to_stand', label: 'Sit to Stand' },
  { key: 'single_leg_balance', label: 'Single Leg Balance' },
  { key: 'gait', label: 'Gait Analysis' },
  { key: 'core_endurance', label: 'Core Endurance (sec)' },
];

const MUSCLE_SLINGS = [
  { key: 'anterior_oblique', label: 'Anterior Oblique Sling' },
  { key: 'posterior_oblique', label: 'Posterior Oblique Sling' },
  { key: 'lateral', label: 'Lateral Sling' },
  { key: 'deep_longitudinal', label: 'Deep Longitudinal Sling' },
];

const SPINAL_REGIONS = ['Cervical', 'Thoracic', 'Lumbar'];
const ROM_MOVEMENTS = ['Flexion', 'Extension', 'L.Rotation', 'R.Rotation', 'L.Lateral', 'R.Lateral'];

const MODE_OPTIONS = ['Mat', 'Reformer', 'Cadillac', 'Chair', 'Barrel', 'Small Props'];
const INFO_SHEETS = [
  'Core activation guide',
  'Breathing techniques',
  'Posture correction tips',
  'Home exercise programme',
  'Pain management guide',
  'Pilates principles overview',
];

type FormData = Omit<PilatesAssessment, 'id' | 'created_at' | 'updated_at'>;

function getInitialForm(studentId: string): FormData {
  return {
    student_id: studentId,
    type: 'initial',
    assessment_date: new Date().toISOString().split('T')[0],
    assessor_name: 'Dr. Shiva Jain Sangoi',
    gender: '',
    occupation: '',
    referred_by: '',
    emergency_contact: '',
    emergency_relation: '',
    presenting_complaint: '',
    past_medical_history: '',
    medications_supplements: '',
    red_flags: {},
    activity_level: '',
    exercise_type: '',
    sitting_hours: '',
    sleep_quality: '',
    stress_level: '',
    smoking: '',
    pain_location: '',
    pain_vas: 0,
    pain_duration: '',
    pain_nature: [],
    pain_frequency: '',
    pain_aggravating: '',
    pain_easing: '',
    posture_anterior: '',
    posture_lateral: '',
    posture_posterior: '',
    posture_key_findings: [],
    body_map: { markers: [] },
    spinal_rom: {},
    muscle_tests: {},
    additional_tests: '',
    appi_elements: {},
    movement_control: {},
    functional_assessment: {},
    muscle_slings: {},
    clinical_impression: '',
    short_term_goals: ['', '', ''],
    long_term_goals: ['', '', ''],
    patient_own_goals: '',
    starting_level: '',
    mode: [],
    assigned_batch_id: '',
    frequency: '',
    duration: '45 min',
    review_weeks: 6,
    batch_days: '',
    programme_notes: '',
    info_sheets_provided: [],
    consent_given: false,
    client_signature: '',
  };
}

export default function InitialAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<PilatesRegistration | null>(null);
  const [batches, setBatches] = useState<PilatesBatch[]>([]);
  const [form, setForm] = useState<FormData>(getInitialForm(studentId));
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, [studentId]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const loadData = async () => {
    const supabase = createClient();

    const [{ data: regData }, { data: batchData }, { data: existingDraft }] = await Promise.all([
      supabase.from('pilates_registrations').select('*').eq('id', studentId).single(),
      supabase.from('pilates_batches').select('*').eq('is_active', true).order('name'),
      supabase
        .from('pilates_assessments')
        .select('*')
        .eq('student_id', studentId)
        .eq('type', 'initial')
        .eq('consent_given', false)
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

    if (regData) {
      setStudent(regData as PilatesRegistration);
      // Pre-fill from registration
      setForm((prev) => ({
        ...prev,
        past_medical_history: regData.medical_history || '',
      }));
    }

    setBatches(batchData || []);

    // Resume draft if exists
    if (existingDraft && existingDraft.length > 0) {
      const draft = existingDraft[0] as PilatesAssessment;
      setDraftId(draft.id);
      setForm({
        ...getInitialForm(studentId),
        ...Object.fromEntries(
          Object.entries(draft).filter(([, v]) => v !== null && v !== undefined)
        ),
        short_term_goals: draft.short_term_goals || ['', '', ''],
        long_term_goals: draft.long_term_goals || ['', '', ''],
      });
    }

    setLoading(false);
  };

  const saveDraft = async () => {
    setSaving(true);
    const supabase = createClient();

    // Clean up empty strings from arrays
    const cleanForm = {
      ...form,
      short_term_goals: (form.short_term_goals || []).filter((g) => g.trim()),
      long_term_goals: (form.long_term_goals || []).filter((g) => g.trim()),
      assigned_batch_id: form.assigned_batch_id || null,
    };

    if (draftId) {
      const { error } = await supabase
        .from('pilates_assessments')
        .update({ ...cleanForm, updated_at: new Date().toISOString() })
        .eq('id', draftId);

      if (error) {
        setToast({ message: 'Failed to save draft', type: 'error' });
      } else {
        setToast({ message: 'Draft saved', type: 'success' });
      }
    } else {
      const { data, error } = await supabase
        .from('pilates_assessments')
        .insert(cleanForm)
        .select('id')
        .single();

      if (error) {
        setToast({ message: 'Failed to save draft', type: 'error' });
      } else {
        setDraftId(data.id);
        setToast({ message: 'Draft saved', type: 'success' });
      }
    }

    setSaving(false);
  };

  const completeAssessment = async () => {
    if (!form.assessor_name.trim()) {
      setToast({ message: 'Assessor name is required', type: 'error' });
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const cleanForm = {
      ...form,
      consent_given: true,
      short_term_goals: (form.short_term_goals || []).filter((g) => g.trim()),
      long_term_goals: (form.long_term_goals || []).filter((g) => g.trim()),
      assigned_batch_id: form.assigned_batch_id || null,
      updated_at: new Date().toISOString(),
    };

    let error;

    if (draftId) {
      ({ error } = await supabase
        .from('pilates_assessments')
        .update(cleanForm)
        .eq('id', draftId));
    } else {
      ({ error } = await supabase
        .from('pilates_assessments')
        .insert(cleanForm));
    }

    if (error) {
      setToast({ message: 'Failed to complete assessment', type: 'error' });
    } else {
      setToast({ message: 'Assessment completed successfully!', type: 'success' });
      setTimeout(() => router.push(`/admin/pilates/students/${studentId}`), 1000);
    }

    setSaving(false);
  };

  const updateForm = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    const arr = (form[field as keyof FormData] as string[]) || [];
    const updated = arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
    updateForm(field, updated);
  };

  const toggleRedFlag = (flag: string) => {
    const flags = { ...(form.red_flags || {}) };
    flags[flag] = !flags[flag];
    updateForm('red_flags', flags);
  };

  const updateNestedJson = (field: string, key: string, value: unknown) => {
    const obj = { ...(form[field as keyof FormData] as Record<string, unknown> || {}) };
    obj[key] = value;
    updateForm(field, obj);
  };

  const updateRom = (region: string, movement: string, value: string) => {
    const rom = { ...(form.spinal_rom || {}) };
    if (!rom[region]) rom[region] = {};
    rom[region] = { ...rom[region], [movement]: value };
    updateForm('spinal_rom', rom);
  };

  const updateGoal = (field: 'short_term_goals' | 'long_term_goals', index: number, value: string) => {
    const goals = [...(form[field] || ['', '', ''])];
    goals[index] = value;
    updateForm(field, goals);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-96 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-md text-sm font-medium shadow-lg ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push(`/admin/pilates/students/${studentId}`)}
          className="p-2 hover:bg-gray-100 rounded-md"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 normal-case">Initial Assessment</h2>
          <p className="text-sm text-gray-500">{student.name} &middot; {student.phone}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentStep === step.id
                  ? 'bg-[#14507c] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                currentStep === step.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.id}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {currentStep === 1 && (
          <StepClientDetails form={form} updateForm={updateForm} student={student} />
        )}
        {currentStep === 2 && (
          <StepHistory form={form} updateForm={updateForm} toggleRedFlag={toggleRedFlag} />
        )}
        {currentStep === 3 && (
          <StepLifestyle form={form} updateForm={updateForm} />
        )}
        {currentStep === 4 && (
          <StepPain form={form} updateForm={updateForm} toggleArrayItem={toggleArrayItem} />
        )}
        {currentStep === 5 && (
          <StepPosture form={form} updateForm={updateForm} toggleArrayItem={toggleArrayItem} />
        )}
        {currentStep === 6 && (
          <StepROM form={form} updateRom={updateRom} updateNestedJson={updateNestedJson} updateForm={updateForm} />
        )}
        {currentStep === 7 && (
          <StepAPPI form={form} updateNestedJson={updateNestedJson} />
        )}
        {currentStep === 8 && (
          <StepMovement form={form} updateNestedJson={updateNestedJson} />
        )}
        {currentStep === 9 && (
          <StepGoals form={form} updateForm={updateForm} updateGoal={updateGoal} />
        )}
        {currentStep === 10 && (
          <StepProgramme
            form={form}
            updateForm={updateForm}
            toggleArrayItem={toggleArrayItem}
            batches={batches}
            onComplete={completeAssessment}
            saving={saving}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <button
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <button
          onClick={saveDraft}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#14507c] border border-[#14507c] rounded-md hover:bg-blue-50 disabled:opacity-50 transition-colors"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Draft'}
        </button>

        {currentStep < 10 ? (
          <button
            onClick={() => setCurrentStep((s) => Math.min(10, s + 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[#14507c] rounded-md hover:bg-[#0f3f63] transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={completeAssessment}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[#e8899c] rounded-md hover:bg-[#d4778a] disabled:opacity-50 transition-colors"
          >
            <Check size={16} />
            {saving ? 'Completing...' : 'Complete Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SHARED INPUT COMPONENTS ─────────────────────────────────────────────────

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = 'text', id }: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  id?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3, id }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
    />
  );
}

function RadioGroup({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2.5 text-sm rounded-md border font-medium transition-colors min-h-[44px] ${
            value === opt.value
              ? 'border-[#14507c] bg-[#14507c] text-white'
              : 'border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function CheckboxGroup({ selected, onToggle, options }: {
  selected: string[];
  onToggle: (item: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={`px-3 py-2 text-sm rounded-md border transition-colors min-h-[44px] ${
            selected.includes(opt)
              ? 'border-[#14507c] bg-blue-50 text-[#14507c] font-medium'
              : 'border-gray-300 text-gray-600 hover:border-gray-400'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
      {children}
    </h3>
  );
}

// ─── STEP COMPONENTS ─────────────────────────────────────────────────────────

function StepClientDetails({
  form,
  updateForm,
  student,
}: {
  form: FormData;
  updateForm: (f: string, v: unknown) => void;
  student: PilatesRegistration;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Client Details</SectionTitle>

      {/* Read-only student info */}
      <div className="bg-gray-50 rounded-md p-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-gray-500">Name</span>
            <p className="font-medium text-gray-800">{student.name}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone</span>
            <p className="font-medium text-gray-800">{student.phone}</p>
          </div>
          <div>
            <span className="text-gray-500">Email</span>
            <p className="font-medium text-gray-800">{student.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Age</span>
            <p className="font-medium text-gray-800">{student.age || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assessment_date">Assessment Date</Label>
          <Input
            id="assessment_date"
            type="date"
            value={form.assessment_date}
            onChange={(v) => updateForm('assessment_date', v)}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <RadioGroup
            value={form.gender || ''}
            onChange={(v) => updateForm('gender', v)}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </div>
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={form.occupation || ''}
            onChange={(v) => updateForm('occupation', v)}
            placeholder="e.g. IT Professional, Homemaker"
          />
        </div>
        <div>
          <Label htmlFor="referred_by">Referred By</Label>
          <Input
            id="referred_by"
            value={form.referred_by || ''}
            onChange={(v) => updateForm('referred_by', v)}
            placeholder="e.g. Dr. Smith, Self"
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact">Emergency Contact</Label>
          <Input
            id="emergency_contact"
            value={form.emergency_contact || ''}
            onChange={(v) => updateForm('emergency_contact', v)}
            placeholder="Name and phone number"
          />
        </div>
        <div>
          <Label htmlFor="emergency_relation">Relation</Label>
          <Input
            id="emergency_relation"
            value={form.emergency_relation || ''}
            onChange={(v) => updateForm('emergency_relation', v)}
            placeholder="e.g. Spouse, Parent"
          />
        </div>
      </div>
    </div>
  );
}

function StepHistory({
  form,
  updateForm,
  toggleRedFlag,
}: {
  form: FormData;
  updateForm: (f: string, v: unknown) => void;
  toggleRedFlag: (flag: string) => void;
}) {
  const activeFlags = Object.entries(form.red_flags || {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="space-y-5">
      <SectionTitle>History of Present Condition & Red Flags</SectionTitle>

      <div>
        <Label htmlFor="presenting_complaint">Presenting Complaint / HOPC</Label>
        <TextArea
          id="presenting_complaint"
          value={form.presenting_complaint || ''}
          onChange={(v) => updateForm('presenting_complaint', v)}
          placeholder="Describe the main reason for consultation, onset, progression..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="past_medical_history">Past Medical History</Label>
        <TextArea
          id="past_medical_history"
          value={form.past_medical_history || ''}
          onChange={(v) => updateForm('past_medical_history', v)}
          placeholder="Previous injuries, surgeries, conditions..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="medications_supplements">Current Medications / Supplements</Label>
        <TextArea
          id="medications_supplements"
          value={form.medications_supplements || ''}
          onChange={(v) => updateForm('medications_supplements', v)}
          placeholder="List current medications and supplements..."
          rows={2}
        />
      </div>

      <div>
        <Label>Red Flags</Label>
        <p className="text-xs text-gray-500 mb-2">Select any that apply</p>
        <div className="flex flex-wrap gap-2">
          {RED_FLAG_OPTIONS.map((flag) => (
            <button
              key={flag}
              type="button"
              onClick={() => toggleRedFlag(flag)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors min-h-[44px] ${
                activeFlags.includes(flag)
                  ? 'border-red-400 bg-red-50 text-red-700 font-medium'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {flag}
            </button>
          ))}
        </div>
        {activeFlags.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            <strong>Warning:</strong> {activeFlags.length} red flag(s) identified. Ensure clinical safety before proceeding.
          </div>
        )}
      </div>
    </div>
  );
}

function StepLifestyle({
  form,
  updateForm,
}: {
  form: FormData;
  updateForm: (f: string, v: unknown) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Activity Level & Lifestyle</SectionTitle>

      <div>
        <Label>Activity Level</Label>
        <RadioGroup
          value={form.activity_level || ''}
          onChange={(v) => updateForm('activity_level', v)}
          options={[
            { value: 'sedentary', label: 'Sedentary' },
            { value: 'light', label: 'Light' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'active', label: 'Active' },
          ]}
        />
      </div>

      <div>
        <Label htmlFor="exercise_type">Current Exercise / Activity</Label>
        <Input
          id="exercise_type"
          value={form.exercise_type || ''}
          onChange={(v) => updateForm('exercise_type', v)}
          placeholder="e.g. Walking, Yoga, Gym, Swimming"
        />
      </div>

      <div>
        <Label htmlFor="sitting_hours">Daily Sitting Hours</Label>
        <Input
          id="sitting_hours"
          value={form.sitting_hours || ''}
          onChange={(v) => updateForm('sitting_hours', v)}
          placeholder="e.g. 6-8 hours"
        />
      </div>

      <div>
        <Label htmlFor="sleep_quality">Sleep Quality</Label>
        <Input
          id="sleep_quality"
          value={form.sleep_quality || ''}
          onChange={(v) => updateForm('sleep_quality', v)}
          placeholder="e.g. Good, Disturbed, 6 hours/night"
        />
      </div>

      <div>
        <Label>Stress Level</Label>
        <RadioGroup
          value={form.stress_level || ''}
          onChange={(v) => updateForm('stress_level', v)}
          options={[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
        />
      </div>

      <div>
        <Label>Smoking</Label>
        <RadioGroup
          value={form.smoking || ''}
          onChange={(v) => updateForm('smoking', v)}
          options={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ]}
        />
      </div>
    </div>
  );
}

function StepPain({
  form,
  updateForm,
  toggleArrayItem,
}: {
  form: FormData;
  updateForm: (f: string, v: unknown) => void;
  toggleArrayItem: (f: string, item: string) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Pain Assessment</SectionTitle>

      <div>
        <Label htmlFor="pain_location">Pain Location</Label>
        <Input
          id="pain_location"
          value={form.pain_location || ''}
          onChange={(v) => updateForm('pain_location', v)}
          placeholder="e.g. Lower back, Right shoulder"
        />
      </div>

      <div>
        <Label>Pain Intensity (VAS 0-10)</Label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={10}
            value={form.pain_vas || 0}
            onChange={(e) => updateForm('pain_vas', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#14507c]"
          />
          <span className={`text-2xl font-bold min-w-[2ch] text-center ${
            (form.pain_vas || 0) <= 3
              ? 'text-green-600'
              : (form.pain_vas || 0) <= 6
                ? 'text-amber-600'
                : 'text-red-600'
          }`}>
            {form.pain_vas || 0}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>No pain</span>
          <span>Worst pain</span>
        </div>
      </div>

      <div>
        <Label htmlFor="pain_duration">Pain Duration</Label>
        <Input
          id="pain_duration"
          value={form.pain_duration || ''}
          onChange={(v) => updateForm('pain_duration', v)}
          placeholder="e.g. 3 months, 2 weeks"
        />
      </div>

      <div>
        <Label>Pain Nature</Label>
        <CheckboxGroup
          selected={form.pain_nature || []}
          onToggle={(item) => toggleArrayItem('pain_nature', item)}
          options={PAIN_NATURE_OPTIONS}
        />
      </div>

      <div>
        <Label>Pain Frequency</Label>
        <RadioGroup
          value={form.pain_frequency || ''}
          onChange={(v) => updateForm('pain_frequency', v)}
          options={[
            { value: 'constant', label: 'Constant' },
            { value: 'intermittent', label: 'Intermittent' },
          ]}
        />
      </div>

      <div>
        <Label htmlFor="pain_aggravating">Aggravating Factors</Label>
        <TextArea
          id="pain_aggravating"
          value={form.pain_aggravating || ''}
          onChange={(v) => updateForm('pain_aggravating', v)}
          placeholder="What makes the pain worse..."
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="pain_easing">Easing Factors</Label>
        <TextArea
          id="pain_easing"
          value={form.pain_easing || ''}
          onChange={(v) => updateForm('pain_easing', v)}
          placeholder="What makes the pain better..."
          rows={2}
        />
      </div>
    </div>
  );
}

function StepPosture({
  form,
  updateForm,
  toggleArrayItem,
}: {
  form: FormData;
  updateForm: (f: string, v: unknown) => void;
  toggleArrayItem: (f: string, item: string) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Posture Assessment & Body Map</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="posture_anterior">Anterior View</Label>
          <TextArea
            id="posture_anterior"
            value={form.posture_anterior || ''}
            onChange={(v) => updateForm('posture_anterior', v)}
            placeholder="Observations from front view..."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="posture_lateral">Lateral View</Label>
          <TextArea
            id="posture_lateral"
            value={form.posture_lateral || ''}
            onChange={(v) => updateForm('posture_lateral', v)}
            placeholder="Observations from side view..."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="posture_posterior">Posterior View</Label>
          <TextArea
            id="posture_posterior"
            value={form.posture_posterior || ''}
            onChange={(v) => updateForm('posture_posterior', v)}
            placeholder="Observations from back view..."
            rows={4}
          />
        </div>
      </div>

      <div>
        <Label>Key Postural Findings</Label>
        <CheckboxGroup
          selected={form.posture_key_findings || []}
          onToggle={(item) => toggleArrayItem('posture_key_findings', item)}
          options={POSTURE_FINDINGS}
        />
      </div>

      {/* Interactive Body Map */}
      <div>
        <Label>Body Map</Label>
        <p className="text-xs text-gray-500 mb-2">Tap on body regions to mark areas of pain, tightness, weakness, or other findings</p>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
          <BodyMap
            markers={(form.body_map?.markers as BodyMapMarker[]) || []}
            onChange={(markers) => updateForm('body_map', { markers })}
          />
        </div>
      </div>
    </div>
  );
}

function StepROM({
  form,
  updateRom,
  updateNestedJson,
  updateForm,
}: {
  form: FormData;
  updateRom: (region: string, movement: string, value: string) => void;
  updateNestedJson: (field: string, key: string, value: unknown) => void;
  updateForm: (f: string, v: unknown) => void;
}) {
  const MUSCLE_TESTS_LIST = [
    'Hip Flexors (Thomas Test)',
    'Hamstrings (SLR)',
    'Piriformis',
    'ITB (Ober Test)',
    'Pectorals',
    'Upper Trapezius',
    'Quadriceps (Ely Test)',
    'Gastroc/Soleus',
  ];

  return (
    <div className="space-y-5">
      <SectionTitle>Spinal ROM & Muscle Length Tests</SectionTitle>

      <div>
        <Label>Spinal Range of Motion</Label>
        <p className="text-xs text-gray-500 mb-2">Record as: Full, Reduced, Limited, Painful, N/A</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">Region</th>
                {ROM_MOVEMENTS.map((m) => (
                  <th key={m} className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200 text-xs">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPINAL_REGIONS.map((region) => (
                <tr key={region}>
                  <td className="py-2 px-3 font-medium text-gray-800 border border-gray-200">{region}</td>
                  {ROM_MOVEMENTS.map((movement) => (
                    <td key={movement} className="py-1 px-1 border border-gray-200">
                      <input
                        type="text"
                        value={form.spinal_rom?.[region]?.[movement] || ''}
                        onChange={(e) => updateRom(region, movement, e.target.value)}
                        className="w-full px-2 py-2 text-xs border-0 focus:outline-none focus:ring-1 focus:ring-[#14507c] rounded min-h-[44px]"
                        placeholder="—"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Label>Muscle Length Tests</Label>
        <p className="text-xs text-gray-500 mb-2">Record as: Normal, Tight, Very Tight, N/A</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MUSCLE_TESTS_LIST.map((test) => (
            <div key={test} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 min-w-[160px]">{test}</span>
              <input
                type="text"
                value={(form.muscle_tests as Record<string, string>)?.[test] || ''}
                onChange={(e) => updateNestedJson('muscle_tests', test, e.target.value)}
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
                placeholder="—"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepAPPI({
  form,
  updateNestedJson,
}: {
  form: FormData;
  updateNestedJson: (field: string, key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>APPI Key Elements Assessment</SectionTitle>
      <p className="text-sm text-gray-500 -mt-2">Rate each element and add observation notes</p>

      <div className="space-y-4">
        {APPI_ELEMENTS.map((el) => {
          const current = (form.appi_elements as Record<string, { rating: string; notes: string }>)?.[el.key] || { rating: '', notes: '' };
          return (
            <div key={el.key} className="bg-gray-50 rounded-md p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-800">{el.label}</h4>
              <div className="flex flex-wrap gap-2">
                {['unable', 'with_cues', 'independent'].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      updateNestedJson('appi_elements', el.key, { ...current, rating })
                    }
                    className={`px-4 py-2.5 text-sm rounded-md border font-medium transition-colors min-h-[44px] capitalize ${
                      current.rating === rating
                        ? rating === 'unable'
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : rating === 'with_cues'
                            ? 'border-amber-400 bg-amber-50 text-amber-700'
                            : 'border-green-400 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {rating.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={current.notes || ''}
                onChange={(e) =>
                  updateNestedJson('appi_elements', el.key, { ...current, notes: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
                placeholder="Notes..."
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepMovement({
  form,
  updateNestedJson,
}: {
  form: FormData;
  updateNestedJson: (field: string, key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionTitle>Movement Control & Functional Assessment</SectionTitle>

      {/* Movement Control */}
      <div>
        <Label>Movement Control Exercises</Label>
        <p className="text-xs text-gray-500 mb-3">Rate each exercise</p>
        <div className="space-y-3">
          {MOVEMENT_EXERCISES.map((ex) => (
            <div key={ex.key} className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-3">
              <span className="text-sm font-medium text-gray-800">{ex.label}</span>
              <div className="flex gap-2">
                {['good', 'fair', 'poor'].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => updateNestedJson('movement_control', ex.key, rating)}
                    className={`px-3 py-2 text-xs rounded-md border font-medium transition-colors min-h-[44px] capitalize ${
                      (form.movement_control as Record<string, string>)?.[ex.key] === rating
                        ? rating === 'good'
                          ? 'border-green-400 bg-green-50 text-green-700'
                          : rating === 'fair'
                            ? 'border-amber-400 bg-amber-50 text-amber-700'
                            : 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Functional Assessment */}
      <div>
        <Label>Functional Assessment</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FUNCTIONAL_TESTS.map((test) => (
            <div key={test.key} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 min-w-[140px]">{test.label}</span>
              <input
                type="text"
                value={(form.functional_assessment as Record<string, string>)?.[test.key] || ''}
                onChange={(e) => updateNestedJson('functional_assessment', test.key, e.target.value)}
                className="flex-1 px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
                placeholder="Result..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Muscle Slings */}
      <div>
        <Label>Muscle Sling Assessment</Label>
        <div className="space-y-3">
          {MUSCLE_SLINGS.map((sling) => (
            <div key={sling.key} className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-3">
              <span className="text-sm font-medium text-gray-800">{sling.label}</span>
              <div className="flex gap-2">
                {['good', 'weak', 'dysfunctional'].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => updateNestedJson('muscle_slings', sling.key, rating)}
                    className={`px-3 py-2 text-xs rounded-md border font-medium transition-colors min-h-[44px] capitalize ${
                      (form.muscle_slings as Record<string, string>)?.[sling.key] === rating
                        ? rating === 'good'
                          ? 'border-green-400 bg-green-50 text-green-700'
                          : rating === 'weak'
                            ? 'border-amber-400 bg-amber-50 text-amber-700'
                            : 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepGoals({
  form,
  updateForm,
  updateGoal,
}: {
  form: FormData;
  updateForm: (f: string, v: unknown) => void;
  updateGoal: (field: 'short_term_goals' | 'long_term_goals', index: number, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Clinical Impression & Goals</SectionTitle>

      <div>
        <Label htmlFor="clinical_impression">Clinical Impression / Summary</Label>
        <TextArea
          id="clinical_impression"
          value={form.clinical_impression || ''}
          onChange={(v) => updateForm('clinical_impression', v)}
          placeholder="Summarize the overall clinical picture, key findings, and reasoning..."
          rows={5}
        />
      </div>

      <div>
        <Label>Short-term Goals (4-6 weeks)</Label>
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-2">
            <Input
              value={(form.short_term_goals || ['', '', ''])[i] || ''}
              onChange={(v) => updateGoal('short_term_goals', i, v)}
              placeholder={`Short-term goal ${i + 1}`}
            />
          </div>
        ))}
      </div>

      <div>
        <Label>Long-term Goals (12+ weeks)</Label>
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-2">
            <Input
              value={(form.long_term_goals || ['', '', ''])[i] || ''}
              onChange={(v) => updateGoal('long_term_goals', i, v)}
              placeholder={`Long-term goal ${i + 1}`}
            />
          </div>
        ))}
      </div>

      <div>
        <Label htmlFor="patient_own_goals">Patient&apos;s Own Goals</Label>
        <TextArea
          id="patient_own_goals"
          value={form.patient_own_goals || ''}
          onChange={(v) => updateForm('patient_own_goals', v)}
          placeholder="What the patient wants to achieve in their own words..."
          rows={3}
        />
      </div>
    </div>
  );
}

function StepProgramme({
  form,
  updateForm,
  toggleArrayItem,
  batches,
  onComplete,
  saving,
}: {
  form: FormData;
  updateForm: (f: string, v: unknown) => void;
  toggleArrayItem: (f: string, item: string) => void;
  batches: PilatesBatch[];
  onComplete: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Recommended Programme & Consent</SectionTitle>

      <div>
        <Label>Starting Level</Label>
        <RadioGroup
          value={form.starting_level || ''}
          onChange={(v) => updateForm('starting_level', v)}
          options={[
            { value: 'rehab', label: 'Rehab' },
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
          ]}
        />
      </div>

      <div>
        <Label>Mode / Equipment</Label>
        <CheckboxGroup
          selected={form.mode || []}
          onToggle={(item) => toggleArrayItem('mode', item)}
          options={MODE_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assigned_batch">Assigned Batch</Label>
          <select
            id="assigned_batch"
            value={form.assigned_batch_id || ''}
            onChange={(e) => updateForm('assigned_batch_id', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white min-h-[44px]"
          >
            <option value="">Select batch...</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.current_count}/{b.capacity})
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Input
            id="frequency"
            value={form.frequency || ''}
            onChange={(v) => updateForm('frequency', v)}
            placeholder="e.g. 2x/week, 3x/week"
          />
        </div>
        <div>
          <Label htmlFor="duration">Session Duration</Label>
          <Input
            id="duration"
            value={form.duration || '45 min'}
            onChange={(v) => updateForm('duration', v)}
            placeholder="e.g. 45 min"
          />
        </div>
        <div>
          <Label htmlFor="review_weeks">Review After (weeks)</Label>
          <Input
            id="review_weeks"
            type="number"
            value={form.review_weeks || 6}
            onChange={(v) => updateForm('review_weeks', parseInt(v) || 0)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="batch_days">Batch Days</Label>
          <Input
            id="batch_days"
            value={form.batch_days || ''}
            onChange={(v) => updateForm('batch_days', v)}
            placeholder="e.g. Mon, Wed, Fri"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="programme_notes">Programme Notes</Label>
        <TextArea
          id="programme_notes"
          value={form.programme_notes || ''}
          onChange={(v) => updateForm('programme_notes', v)}
          placeholder="Special instructions, modifications, precautions..."
          rows={3}
        />
      </div>

      <div>
        <Label>Info Sheets Provided</Label>
        <CheckboxGroup
          selected={form.info_sheets_provided || []}
          onToggle={(item) => toggleArrayItem('info_sheets_provided', item)}
          options={INFO_SHEETS}
        />
      </div>

      <div className="border-t border-gray-200 pt-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-800">Consent & Signature</h4>

        <div>
          <Label htmlFor="assessor_name">Assessor Name</Label>
          <Input
            id="assessor_name"
            value={form.assessor_name}
            onChange={(v) => updateForm('assessor_name', v)}
            placeholder="Therapist name"
          />
        </div>

        <div>
          <Label htmlFor="client_signature">Client Signature (type full name)</Label>
          <Input
            id="client_signature"
            value={form.client_signature || ''}
            onChange={(v) => updateForm('client_signature', v)}
            placeholder="Client types their full name as signature"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent_given || false}
            onChange={(e) => updateForm('consent_given', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#14507c] focus:ring-[#14507c]"
          />
          <span className="text-sm text-gray-700">
            I have explained the assessment findings, recommended programme, and treatment plan to the client.
            The client understands and consents to participate in the Pilates programme.
          </span>
        </label>
      </div>

      <button
        onClick={onComplete}
        disabled={saving || !form.consent_given || !form.client_signature?.trim()}
        className="w-full py-3 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
      >
        {saving ? 'Completing Assessment...' : 'Complete & Save Assessment'}
      </button>

      {(!form.consent_given || !form.client_signature?.trim()) && (
        <p className="text-xs text-amber-600 text-center">
          Consent checkbox and client signature are required to complete the assessment.
        </p>
      )}
    </div>
  );
}
