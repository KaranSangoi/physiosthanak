'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Check, ChevronDown, Plus, Trash2 } from 'lucide-react';
import type {
  Patient,
  PatientAssessment,
  PatientClientDetails,
  PatientHistory,
  PatientLifestyle,
  PatientPain,
  PatientPosture,
  PatientROM,
  PatientSpecialTests,
  PatientGoals,
  PatientTreatmentPlan,
  JointMovement,
  OrthopedicTest,
  TestSide,
  TestResult,
  PrescribedExercise,
} from '@/types/patient';
import type { BodyMapMarker } from '@/types/pilates';
import BodyMap from '@/components/admin/BodyMap';
import { saveDraft, completeAssessment, type AssessmentFormData } from './actions';

// ─── CONSTANTS ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Client Details' },
  { id: 2, label: 'History' },
  { id: 3, label: 'Lifestyle' },
  { id: 4, label: 'Pain' },
  { id: 5, label: 'Posture' },
  { id: 6, label: 'Range of Motion' },
  { id: 7, label: 'Special Tests' },
  { id: 8, label: 'Goals' },
  { id: 9, label: 'Treatment Plan' },
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

// ─── ROM CONFIG ────────────────────────────────────────────────────────────

interface MovementDef {
  key: string;
  label: string;
  /** Normal range upper bound (deg), shown as placeholder */
  normal: number;
  /** True for unilateral spinal/single movements (still recorded as L/R for symmetry checks) */
}

interface JointGroupDef {
  key: keyof PatientROM;
  label: string;
  movements: MovementDef[];
}

const JOINT_GROUPS: JointGroupDef[] = [
  {
    key: 'cervical',
    label: 'Cervical',
    movements: [
      { key: 'flexion', label: 'Flexion', normal: 50 },
      { key: 'extension', label: 'Extension', normal: 60 },
      { key: 'lateral_flexion', label: 'Lateral Flexion (L/R)', normal: 45 },
      { key: 'rotation', label: 'Rotation (L/R)', normal: 80 },
    ],
  },
  {
    key: 'shoulder',
    label: 'Shoulder',
    movements: [
      { key: 'flexion', label: 'Flexion', normal: 180 },
      { key: 'extension', label: 'Extension', normal: 50 },
      { key: 'abduction', label: 'Abduction', normal: 180 },
      { key: 'adduction', label: 'Adduction', normal: 50 },
      { key: 'internal_rotation', label: 'Internal Rotation', normal: 90 },
      { key: 'external_rotation', label: 'External Rotation', normal: 90 },
    ],
  },
  {
    key: 'elbow',
    label: 'Elbow',
    movements: [
      { key: 'flexion', label: 'Flexion', normal: 150 },
      { key: 'extension', label: 'Extension', normal: 0 },
      { key: 'supination', label: 'Supination', normal: 90 },
      { key: 'pronation', label: 'Pronation', normal: 90 },
    ],
  },
  {
    key: 'wrist',
    label: 'Wrist',
    movements: [
      { key: 'flexion', label: 'Flexion', normal: 80 },
      { key: 'extension', label: 'Extension', normal: 70 },
      { key: 'radial_deviation', label: 'Radial Deviation', normal: 20 },
      { key: 'ulnar_deviation', label: 'Ulnar Deviation', normal: 30 },
    ],
  },
  {
    key: 'hip',
    label: 'Hip',
    movements: [
      { key: 'flexion', label: 'Flexion', normal: 120 },
      { key: 'extension', label: 'Extension', normal: 30 },
      { key: 'abduction', label: 'Abduction', normal: 45 },
      { key: 'adduction', label: 'Adduction', normal: 30 },
      { key: 'internal_rotation', label: 'Internal Rotation', normal: 45 },
      { key: 'external_rotation', label: 'External Rotation', normal: 45 },
    ],
  },
  {
    key: 'knee',
    label: 'Knee',
    movements: [
      { key: 'flexion', label: 'Flexion', normal: 135 },
      { key: 'extension', label: 'Extension', normal: 0 },
    ],
  },
  {
    key: 'ankle',
    label: 'Ankle',
    movements: [
      { key: 'dorsiflexion', label: 'Dorsiflexion', normal: 20 },
      { key: 'plantarflexion', label: 'Plantarflexion', normal: 50 },
      { key: 'inversion', label: 'Inversion', normal: 35 },
      { key: 'eversion', label: 'Eversion', normal: 20 },
    ],
  },
  {
    key: 'lumbar',
    label: 'Lumbar',
    movements: [
      { key: 'flexion', label: 'Flexion', normal: 90 },
      { key: 'extension', label: 'Extension', normal: 30 },
      { key: 'lateral_flexion', label: 'Lateral Flexion (L/R)', normal: 30 },
      { key: 'rotation', label: 'Rotation (L/R)', normal: 45 },
    ],
  },
];

// ─── SPECIAL TESTS CONFIG ──────────────────────────────────────────────────

const ORTHO_TEST_OPTIONS = [
  // Spine
  'SLR (Straight Leg Raise)',
  'Slump Test',
  'Femoral Nerve Stretch',
  "Spurling's",
  'Distraction',
  // Shoulder
  'Empty Can',
  'Hawkins-Kennedy',
  'Neer',
  'Apprehension',
  'Drop Arm',
  "Speed's",
  "Yergason's",
  // Knee
  'Lachman',
  'Anterior Drawer (Knee)',
  'Posterior Drawer (Knee)',
  'McMurray',
  "Apley's",
  'Valgus Stress',
  'Varus Stress',
  // Hip
  "FABER (Patrick's)",
  'FADIR',
  'Thomas Test',
  'Trendelenburg',
  "Ober's",
  // Ankle
  'Anterior Drawer (Ankle)',
  'Talar Tilt',
  'Thompson',
  'Squeeze',
  // Custom
  'Other (custom)',
];

const REFLEX_TARGETS = ['Biceps', 'Triceps', 'Brachioradialis', 'Patellar', 'Achilles'];
const REFLEX_GRADES = ['0', '1+', '2+', '3+', '4+'];

const DERMATOMES = [
  'C5', 'C6', 'C7', 'C8', 'T1',
  'L1', 'L2', 'L3', 'L4', 'L5',
  'S1', 'S2',
];
const SENSATION_MODES = ['Light touch', 'Pin prick', 'Vibration'];
const SENSATION_GRADES = ['Normal', 'Decreased', 'Absent'];

const MYOTOMES = [
  { key: 'C5', label: 'C5 (Shoulder Abduction)' },
  { key: 'C6', label: 'C6 (Elbow Flexion / Wrist Ext)' },
  { key: 'C7', label: 'C7 (Elbow Extension)' },
  { key: 'C8', label: 'C8 (Thumb Extension)' },
  { key: 'T1', label: 'T1 (Finger Abd/Add)' },
  { key: 'L2', label: 'L2 (Hip Flexion)' },
  { key: 'L3', label: 'L3 (Knee Extension)' },
  { key: 'L4', label: 'L4 (Ankle Dorsiflexion)' },
  { key: 'L5', label: 'L5 (Great Toe Extension)' },
  { key: 'S1', label: 'S1 (Ankle Plantarflexion)' },
];
const MMT_GRADES = ['0', '1', '2', '3', '4', '5'];

// ─── TREATMENT PLAN CONFIG ─────────────────────────────────────────────────

// Note: Clinic does NOT do dry needling or cupping (per CLAUDE.md). Excluded.
const MODALITY_OPTIONS = [
  'Ultrasound',
  'TENS',
  'IFT',
  'SWD',
  'Heat',
  'Cold',
  'Wax',
  'Laser',
];

const MANUAL_THERAPY_OPTIONS = [
  'Joint Mobilization',
  'Manipulation',
  'MET (Muscle Energy)',
  'MFR (Myofascial Release)',
  'Trigger Point Release',
  'Soft Tissue Mobilization',
  'Stretching',
  'PNF',
];

// ─── INITIAL FORM ──────────────────────────────────────────────────────────

function getInitialForm(): AssessmentFormData {
  return {
    assessment_date: new Date().toISOString().split('T')[0],
    assessor: 'Dr. Shiva Jain Sangoi',
    client_details: {
      gender: '',
      occupation: '',
      referred_by: '',
      emergency_contact: '',
      emergency_relation: '',
    },
    history: {
      presenting_complaint: '',
      past_medical_history: '',
      medications_supplements: '',
      allergies: '',
      red_flags: {},
    },
    lifestyle: {
      activity_level: undefined,
      exercise_type: '',
      sitting_hours: '',
      sleep_quality: '',
      stress_level: undefined,
      smoking: undefined,
    },
    pain: {
      pain_location: '',
      pain_vas: 0,
      pain_duration: '',
      pain_nature: [],
      pain_frequency: undefined,
      pain_aggravating: '',
      pain_easing: '',
    },
    posture: {
      posture_anterior: '',
      posture_lateral: '',
      posture_posterior: '',
      posture_key_findings: [],
      body_map: { markers: [] },
    },
    rom: {},
    special_tests: {
      orthopedic: [],
      neurological: { reflexes: {}, sensation: {}, muscle_strength: {} },
      functional: {},
      notes: '',
    },
    goals: {
      short_term_goals: ['', '', ''],
      long_term_goals: ['', '', ''],
      patient_own_goals: '',
    },
    treatment_plan: {
      modalities: [],
      manual_therapy: [],
      exercises: [],
      home_program: '',
      frequency_per_week: undefined,
      duration_weeks: undefined,
      follow_up_date: '',
      precautions: '',
      notes: '',
    },
  };
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────

export default function PatientAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState<AssessmentFormData>(getInitialForm());
  const [signedConsent, setSignedConsent] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Track whether form has been mutated since last save (for autosave)
  const dirtyRef = useRef(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load patient + existing draft ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const [{ data: patientData }, { data: existingDraft }] = await Promise.all([
        supabase.from('patients').select('*').eq('id', patientId).single(),
        supabase
          .from('patient_assessments')
          .select('*')
          .eq('patient_id', patientId)
          .eq('draft', true)
          .order('created_at', { ascending: false })
          .limit(1),
      ]);

      if (cancelled) return;

      if (patientData) {
        setPatient(patientData as Patient);
        // Pre-fill from patient record where reasonable
        const p = patientData as Patient;
        setForm((prev) => ({
          ...prev,
          client_details: {
            ...prev.client_details,
            gender: p.gender || prev.client_details.gender,
            occupation: p.occupation || prev.client_details.occupation,
            referred_by: p.referring_doctor || prev.client_details.referred_by,
            emergency_contact:
              [p.emergency_contact_name, p.emergency_contact_phone].filter(Boolean).join(' — ') ||
              prev.client_details.emergency_contact,
          },
          history: {
            ...prev.history,
            presenting_complaint: p.chief_complaint || prev.history.presenting_complaint,
            past_medical_history: p.medical_history || prev.history.past_medical_history,
            medications_supplements:
              p.current_medications || prev.history.medications_supplements,
            allergies: p.allergies || prev.history.allergies,
          },
        }));
      }

      if (existingDraft && existingDraft.length > 0) {
        const draft = existingDraft[0] as PatientAssessment;
        setDraftId(draft.id);
        setForm({
          assessment_date: draft.assessment_date || new Date().toISOString().split('T')[0],
          assessor: draft.assessor || 'Dr. Shiva Jain Sangoi',
          client_details: { ...getInitialForm().client_details, ...(draft.client_details || {}) },
          history: { ...getInitialForm().history, ...(draft.history || {}) },
          lifestyle: { ...getInitialForm().lifestyle, ...(draft.lifestyle || {}) },
          pain: { ...getInitialForm().pain, ...(draft.pain || {}) },
          posture: { ...getInitialForm().posture, ...(draft.posture || {}) },
          rom: { ...(draft.rom || {}) },
          special_tests: { ...getInitialForm().special_tests, ...(draft.special_tests || {}) },
          goals: { ...getInitialForm().goals, ...(draft.goals || {}) },
          treatment_plan: { ...getInitialForm().treatment_plan, ...(draft.treatment_plan || {}) },
        });
      }

      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  // ── Toast auto-dismiss ───────────────────────────────────────────────────
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ── Autosave (debounced 3s after last change) ────────────────────────────
  useEffect(() => {
    if (loading) return;
    if (!dirtyRef.current) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      void doSaveDraft({ silent: true });
    }, 3000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
    // We intentionally depend on `form` so any field change re-arms the timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, loading]);

  // ── Mutators ─────────────────────────────────────────────────────────────

  const markDirty = () => {
    dirtyRef.current = true;
  };

  function updateStep<K extends keyof AssessmentFormData>(
    step: K,
    updater: (prev: AssessmentFormData[K]) => AssessmentFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [step]: updater(prev[step]) }));
    markDirty();
  }

  function updateTopLevel<K extends keyof AssessmentFormData>(
    key: K,
    value: AssessmentFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    markDirty();
  }

  // ── Save / complete actions ──────────────────────────────────────────────

  async function doSaveDraft({ silent = false }: { silent?: boolean } = {}) {
    if (saving) return;
    setSaving(true);
    const result = await saveDraft(patientId, form, draftId);
    setSaving(false);
    dirtyRef.current = false;
    if (result.ok) {
      if (!draftId) setDraftId(result.data.id);
      if (!silent) setToast({ message: 'Draft saved', type: 'success' });
    } else {
      setToast({ message: `Save failed: ${result.error}`, type: 'error' });
    }
  }

  async function doComplete() {
    if (saving) return;
    if (!signedConsent) {
      setToast({ message: 'Consent checkbox is required', type: 'error' });
      return;
    }
    if (!signatureName.trim()) {
      setToast({ message: 'Signature name is required', type: 'error' });
      return;
    }
    setSaving(true);
    const result = await completeAssessment(
      patientId,
      draftId,
      form,
      signedConsent,
      signatureName,
    );
    setSaving(false);
    if (result.ok) {
      setToast({ message: 'Assessment completed', type: 'success' });
      setTimeout(() => router.push(`/admin/patients/${patientId}`), 800);
    } else {
      setToast({ message: `Complete failed: ${result.error}`, type: 'error' });
    }
  }

  // ── Loading / not-found ─────────────────────────────────────────────────

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

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Patient not found.</p>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

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
          onClick={() => router.push(`/admin/patients/${patientId}`)}
          className="p-2 hover:bg-gray-100 rounded-md"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 normal-case">Patient Assessment</h2>
          <p className="text-sm text-gray-500">
            {patient.name}
            {patient.contact_phone ? ` · ${patient.contact_phone}` : ''}
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {STEPS.map((step) => (
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

      {/* Step content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {currentStep === 1 && (
          <StepClientDetails
            form={form}
            patient={patient}
            updateClientDetails={(u) => updateStep('client_details', u)}
            updateAssessmentDate={(v) => updateTopLevel('assessment_date', v)}
            updateAssessor={(v) => updateTopLevel('assessor', v)}
          />
        )}
        {currentStep === 2 && (
          <StepHistory form={form} updateHistory={(u) => updateStep('history', u)} />
        )}
        {currentStep === 3 && (
          <StepLifestyle form={form} updateLifestyle={(u) => updateStep('lifestyle', u)} />
        )}
        {currentStep === 4 && (
          <StepPain form={form} updatePain={(u) => updateStep('pain', u)} />
        )}
        {currentStep === 5 && (
          <StepPosture form={form} updatePosture={(u) => updateStep('posture', u)} />
        )}
        {currentStep === 6 && (
          <StepROM form={form} updateROM={(u) => updateStep('rom', u)} />
        )}
        {currentStep === 7 && (
          <StepSpecialTests
            form={form}
            updateSpecialTests={(u) => updateStep('special_tests', u)}
          />
        )}
        {currentStep === 8 && (
          <StepGoals form={form} updateGoals={(u) => updateStep('goals', u)} />
        )}
        {currentStep === 9 && (
          <StepTreatmentPlan
            form={form}
            updateTreatmentPlan={(u) => updateStep('treatment_plan', u)}
            signedConsent={signedConsent}
            setSignedConsent={(v) => { setSignedConsent(v); markDirty(); }}
            signatureName={signatureName}
            setSignatureName={(v) => { setSignatureName(v); markDirty(); }}
            assessor={form.assessor}
            updateAssessor={(v) => updateTopLevel('assessor', v)}
            onComplete={doComplete}
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
          onClick={() => doSaveDraft()}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#14507c] border border-[#14507c] rounded-md hover:bg-blue-50 disabled:opacity-50 transition-colors"
        >
          <Save size={16} />
          {saving ? 'Saving…' : 'Save Draft'}
        </button>

        {currentStep < 9 ? (
          <button
            onClick={() => setCurrentStep((s) => Math.min(9, s + 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[#14507c] rounded-md hover:bg-[#0f3f63] transition-colors"
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={doComplete}
            disabled={saving || !signedConsent || !signatureName.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-[#e8899c] rounded-md hover:bg-[#d4778a] disabled:opacity-50 transition-colors"
          >
            <Check size={16} />
            {saving ? 'Completing…' : 'Complete Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SHARED INPUTS ─────────────────────────────────────────────────────────

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  id,
}: {
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

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
  id,
}: {
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

function RadioGroup({
  value,
  onChange,
  options,
}: {
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

function CheckboxGroup({
  selected,
  onToggle,
  options,
}: {
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

// ─── STEP 1: Client Details ────────────────────────────────────────────────

function StepClientDetails({
  form,
  patient,
  updateClientDetails,
  updateAssessmentDate,
  updateAssessor,
}: {
  form: AssessmentFormData;
  patient: Patient;
  updateClientDetails: (u: (prev: PatientClientDetails) => PatientClientDetails) => void;
  updateAssessmentDate: (v: string) => void;
  updateAssessor: (v: string) => void;
}) {
  const cd = form.client_details;
  return (
    <div className="space-y-5">
      <SectionTitle>Client Details</SectionTitle>

      {/* Read-only patient info */}
      <div className="bg-gray-50 rounded-md p-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-gray-500">Name</span>
            <p className="font-medium text-gray-800">{patient.name}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone</span>
            <p className="font-medium text-gray-800">{patient.contact_phone || '—'}</p>
          </div>
          <div>
            <span className="text-gray-500">Email</span>
            <p className="font-medium text-gray-800">{patient.contact_email || '—'}</p>
          </div>
          <div>
            <span className="text-gray-500">Age</span>
            <p className="font-medium text-gray-800">{patient.age ?? '—'}</p>
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
            onChange={updateAssessmentDate}
          />
        </div>
        <div>
          <Label htmlFor="assessor">Assessor</Label>
          <Input
            id="assessor"
            value={form.assessor}
            onChange={updateAssessor}
            placeholder="Therapist name"
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Input
            id="gender"
            value={cd.gender || ''}
            onChange={(v) => updateClientDetails((p) => ({ ...p, gender: v }))}
            placeholder="e.g. Female, Male"
          />
        </div>
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={cd.occupation || ''}
            onChange={(v) => updateClientDetails((p) => ({ ...p, occupation: v }))}
            placeholder="e.g. IT Professional, Homemaker"
          />
        </div>
        <div>
          <Label htmlFor="referred_by">Referred By</Label>
          <Input
            id="referred_by"
            value={cd.referred_by || ''}
            onChange={(v) => updateClientDetails((p) => ({ ...p, referred_by: v }))}
            placeholder="e.g. Dr. Smith, Self"
          />
        </div>
        <div>
          <Label htmlFor="emergency_contact">Emergency Contact</Label>
          <Input
            id="emergency_contact"
            value={cd.emergency_contact || ''}
            onChange={(v) => updateClientDetails((p) => ({ ...p, emergency_contact: v }))}
            placeholder="Name and phone number"
          />
        </div>
        <div>
          <Label htmlFor="emergency_relation">Relation</Label>
          <Input
            id="emergency_relation"
            value={cd.emergency_relation || ''}
            onChange={(v) => updateClientDetails((p) => ({ ...p, emergency_relation: v }))}
            placeholder="e.g. Spouse, Parent"
          />
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: History ───────────────────────────────────────────────────────

function StepHistory({
  form,
  updateHistory,
}: {
  form: AssessmentFormData;
  updateHistory: (u: (prev: PatientHistory) => PatientHistory) => void;
}) {
  const h = form.history;
  const activeFlags = Object.entries(h.red_flags || {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  return (
    <div className="space-y-5">
      <SectionTitle>History of Present Condition & Red Flags</SectionTitle>

      <div>
        <Label htmlFor="presenting_complaint">Presenting Complaint / HOPC</Label>
        <TextArea
          id="presenting_complaint"
          value={h.presenting_complaint || ''}
          onChange={(v) => updateHistory((p) => ({ ...p, presenting_complaint: v }))}
          placeholder="Describe the main reason for consultation, onset, progression…"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="past_medical_history">Past Medical History</Label>
        <TextArea
          id="past_medical_history"
          value={h.past_medical_history || ''}
          onChange={(v) => updateHistory((p) => ({ ...p, past_medical_history: v }))}
          placeholder="Previous injuries, surgeries, conditions…"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="medications_supplements">Current Medications / Supplements</Label>
        <TextArea
          id="medications_supplements"
          value={h.medications_supplements || ''}
          onChange={(v) => updateHistory((p) => ({ ...p, medications_supplements: v }))}
          placeholder="List current medications and supplements…"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <TextArea
          id="allergies"
          value={h.allergies || ''}
          onChange={(v) => updateHistory((p) => ({ ...p, allergies: v }))}
          placeholder="Drug, food, environmental allergies…"
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
              onClick={() =>
                updateHistory((p) => {
                  const flags = { ...(p.red_flags || {}) };
                  flags[flag] = !flags[flag];
                  return { ...p, red_flags: flags };
                })
              }
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

// ─── STEP 3: Lifestyle ─────────────────────────────────────────────────────

function StepLifestyle({
  form,
  updateLifestyle,
}: {
  form: AssessmentFormData;
  updateLifestyle: (u: (prev: PatientLifestyle) => PatientLifestyle) => void;
}) {
  const l = form.lifestyle;
  return (
    <div className="space-y-5">
      <SectionTitle>Activity Level & Lifestyle</SectionTitle>

      <div>
        <Label>Activity Level</Label>
        <RadioGroup
          value={l.activity_level || ''}
          onChange={(v) =>
            updateLifestyle((p) => ({ ...p, activity_level: v as PatientLifestyle['activity_level'] }))
          }
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
          value={l.exercise_type || ''}
          onChange={(v) => updateLifestyle((p) => ({ ...p, exercise_type: v }))}
          placeholder="e.g. Walking, Yoga, Gym, Swimming"
        />
      </div>

      <div>
        <Label htmlFor="sitting_hours">Daily Sitting Hours</Label>
        <Input
          id="sitting_hours"
          value={l.sitting_hours || ''}
          onChange={(v) => updateLifestyle((p) => ({ ...p, sitting_hours: v }))}
          placeholder="e.g. 6-8 hours"
        />
      </div>

      <div>
        <Label htmlFor="sleep_quality">Sleep Quality</Label>
        <Input
          id="sleep_quality"
          value={l.sleep_quality || ''}
          onChange={(v) => updateLifestyle((p) => ({ ...p, sleep_quality: v }))}
          placeholder="e.g. Good, Disturbed, 6 hours/night"
        />
      </div>

      <div>
        <Label>Stress Level</Label>
        <RadioGroup
          value={l.stress_level || ''}
          onChange={(v) =>
            updateLifestyle((p) => ({ ...p, stress_level: v as PatientLifestyle['stress_level'] }))
          }
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
          value={l.smoking || ''}
          onChange={(v) =>
            updateLifestyle((p) => ({ ...p, smoking: v as PatientLifestyle['smoking'] }))
          }
          options={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ]}
        />
      </div>
    </div>
  );
}

// ─── STEP 4: Pain ──────────────────────────────────────────────────────────

function StepPain({
  form,
  updatePain,
}: {
  form: AssessmentFormData;
  updatePain: (u: (prev: PatientPain) => PatientPain) => void;
}) {
  const pn = form.pain;
  return (
    <div className="space-y-5">
      <SectionTitle>Pain Assessment</SectionTitle>

      <div>
        <Label htmlFor="pain_location">Pain Location</Label>
        <Input
          id="pain_location"
          value={pn.pain_location || ''}
          onChange={(v) => updatePain((p) => ({ ...p, pain_location: v }))}
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
            value={pn.pain_vas ?? 0}
            onChange={(e) => updatePain((p) => ({ ...p, pain_vas: parseInt(e.target.value) }))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#14507c]"
          />
          <span className={`text-2xl font-bold min-w-[2ch] text-center ${
            (pn.pain_vas ?? 0) <= 3
              ? 'text-green-600'
              : (pn.pain_vas ?? 0) <= 6
                ? 'text-amber-600'
                : 'text-red-600'
          }`}>
            {pn.pain_vas ?? 0}
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
          value={pn.pain_duration || ''}
          onChange={(v) => updatePain((p) => ({ ...p, pain_duration: v }))}
          placeholder="e.g. 3 months, 2 weeks"
        />
      </div>

      <div>
        <Label>Pain Nature</Label>
        <CheckboxGroup
          selected={pn.pain_nature || []}
          onToggle={(item) =>
            updatePain((p) => {
              const arr = p.pain_nature || [];
              const updated = arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
              return { ...p, pain_nature: updated };
            })
          }
          options={PAIN_NATURE_OPTIONS}
        />
      </div>

      <div>
        <Label>Pain Frequency</Label>
        <RadioGroup
          value={pn.pain_frequency || ''}
          onChange={(v) =>
            updatePain((p) => ({ ...p, pain_frequency: v as PatientPain['pain_frequency'] }))
          }
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
          value={pn.pain_aggravating || ''}
          onChange={(v) => updatePain((p) => ({ ...p, pain_aggravating: v }))}
          placeholder="What makes the pain worse…"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="pain_easing">Easing Factors</Label>
        <TextArea
          id="pain_easing"
          value={pn.pain_easing || ''}
          onChange={(v) => updatePain((p) => ({ ...p, pain_easing: v }))}
          placeholder="What makes the pain better…"
          rows={2}
        />
      </div>
    </div>
  );
}

// ─── STEP 5: Posture ───────────────────────────────────────────────────────

function StepPosture({
  form,
  updatePosture,
}: {
  form: AssessmentFormData;
  updatePosture: (u: (prev: PatientPosture) => PatientPosture) => void;
}) {
  const p = form.posture;
  return (
    <div className="space-y-5">
      <SectionTitle>Posture Assessment & Body Map</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="posture_anterior">Anterior View</Label>
          <TextArea
            id="posture_anterior"
            value={p.posture_anterior || ''}
            onChange={(v) => updatePosture((prev) => ({ ...prev, posture_anterior: v }))}
            placeholder="Observations from front view…"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="posture_lateral">Lateral View</Label>
          <TextArea
            id="posture_lateral"
            value={p.posture_lateral || ''}
            onChange={(v) => updatePosture((prev) => ({ ...prev, posture_lateral: v }))}
            placeholder="Observations from side view…"
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="posture_posterior">Posterior View</Label>
          <TextArea
            id="posture_posterior"
            value={p.posture_posterior || ''}
            onChange={(v) => updatePosture((prev) => ({ ...prev, posture_posterior: v }))}
            placeholder="Observations from back view…"
            rows={4}
          />
        </div>
      </div>

      <div>
        <Label>Key Postural Findings</Label>
        <CheckboxGroup
          selected={p.posture_key_findings || []}
          onToggle={(item) =>
            updatePosture((prev) => {
              const arr = prev.posture_key_findings || [];
              const updated = arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
              return { ...prev, posture_key_findings: updated };
            })
          }
          options={POSTURE_FINDINGS}
        />
      </div>

      <div>
        <Label>Body Map</Label>
        <p className="text-xs text-gray-500 mb-2">Tap on body regions to mark areas of pain, tightness, weakness, or other findings</p>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
          <BodyMap
            markers={(p.body_map?.markers as BodyMapMarker[]) || []}
            onChange={(markers) => updatePosture((prev) => ({ ...prev, body_map: { markers } }))}
          />
        </div>
      </div>
    </div>
  );
}

// ─── STEP 6: ROM (NEW) ─────────────────────────────────────────────────────

function StepROM({
  form,
  updateROM,
}: {
  form: AssessmentFormData;
  updateROM: (u: (prev: PatientROM) => PatientROM) => void;
}) {
  // Default open: cervical + lumbar (per spec)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    cervical: true,
    lumbar: true,
  });

  const toggleGroup = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateMovement = useCallback(
    (
      group: keyof PatientROM,
      movement: string,
      patch: Partial<JointMovement>,
    ) => {
      updateROM((prev) => {
        const groupData = (prev[group] || {}) as Record<string, JointMovement>;
        const current = groupData[movement] || {};
        return {
          ...prev,
          [group]: {
            ...groupData,
            [movement]: { ...current, ...patch },
          },
        };
      });
    },
    [updateROM],
  );

  return (
    <div className="space-y-4">
      <SectionTitle>Range of Motion (degrees)</SectionTitle>
      <p className="text-xs text-gray-500 -mt-2">
        Record measured ROM in degrees for each side. Placeholder shows reference normal.
        Mark painful movements and add notes as needed.
      </p>

      {JOINT_GROUPS.map((group) => {
        const isOpen = expanded[group.key as string] || false;
        const groupData = (form.rom[group.key] || {}) as Record<string, JointMovement>;
        const filledCount = Object.values(groupData).filter(
          (m) => m && (m.left != null || m.right != null || m.painful || m.notes),
        ).length;

        return (
          <div
            key={group.key as string}
            className="border border-gray-200 rounded-md overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggleGroup(group.key as string)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                />
                <span className="text-sm font-semibold text-gray-800">{group.label}</span>
                {filledCount > 0 && (
                  <span className="text-xs text-gray-500">({filledCount} recorded)</span>
                )}
              </div>
            </button>

            {isOpen && (
              <div className="p-4 space-y-3">
                {/* Header row (visible on sm+) */}
                <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1">
                  <div className="col-span-3">Movement</div>
                  <div className="col-span-2">Right (°)</div>
                  <div className="col-span-2">Left (°)</div>
                  <div className="col-span-1 text-center">Pain</div>
                  <div className="col-span-4">Notes</div>
                </div>

                {group.movements.map((mv) => {
                  const cur: JointMovement = groupData[mv.key] || {};
                  return (
                    <div
                      key={mv.key}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-3 text-sm text-gray-700 font-medium">
                        {mv.label}
                        <span className="text-xs text-gray-400 ml-1">
                          (norm 0-{mv.normal}°)
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          inputMode="numeric"
                          value={cur.right ?? ''}
                          onChange={(e) =>
                            updateMovement(group.key, mv.key, {
                              right: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })
                          }
                          placeholder={`0-${mv.normal}`}
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[40px]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          inputMode="numeric"
                          value={cur.left ?? ''}
                          onChange={(e) =>
                            updateMovement(group.key, mv.key, {
                              left: e.target.value === '' ? undefined : parseFloat(e.target.value),
                            })
                          }
                          placeholder={`0-${mv.normal}`}
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[40px]"
                        />
                      </div>
                      <div className="sm:col-span-1 flex items-center justify-center">
                        <label className="inline-flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!cur.painful}
                            onChange={(e) =>
                              updateMovement(group.key, mv.key, { painful: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="sm:hidden text-xs text-gray-600">Painful</span>
                        </label>
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={cur.notes || ''}
                          onChange={(e) =>
                            updateMovement(group.key, mv.key, { notes: e.target.value })
                          }
                          placeholder="Notes…"
                          className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[40px]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── STEP 7: Special Tests (NEW) ───────────────────────────────────────────

function StepSpecialTests({
  form,
  updateSpecialTests,
}: {
  form: AssessmentFormData;
  updateSpecialTests: (u: (prev: PatientSpecialTests) => PatientSpecialTests) => void;
}) {
  const st = form.special_tests;
  const ortho: OrthopedicTest[] = st.orthopedic || [];

  const addOrtho = () => {
    updateSpecialTests((prev) => ({
      ...prev,
      orthopedic: [
        ...(prev.orthopedic || []),
        { test_name: '', side: 'bilateral', result: 'negative', notes: '' },
      ],
    }));
  };

  const updateOrthoRow = (idx: number, patch: Partial<OrthopedicTest>) => {
    updateSpecialTests((prev) => {
      const list = [...(prev.orthopedic || [])];
      list[idx] = { ...list[idx], ...patch };
      return { ...prev, orthopedic: list };
    });
  };

  const removeOrtho = (idx: number) => {
    updateSpecialTests((prev) => {
      const list = [...(prev.orthopedic || [])];
      list.splice(idx, 1);
      return { ...prev, orthopedic: list };
    });
  };

  const updateNeuro = (
    section: 'reflexes' | 'sensation' | 'muscle_strength',
    key: string,
    value: string,
  ) => {
    updateSpecialTests((prev) => {
      const neuro = prev.neurological || {};
      const sectionData = { ...((neuro[section] as Record<string, string>) || {}) };
      if (value === '') {
        delete sectionData[key];
      } else {
        sectionData[key] = value;
      }
      return {
        ...prev,
        neurological: { ...neuro, [section]: sectionData },
      };
    });
  };

  const updateFunctional = (key: string, value: string) => {
    updateSpecialTests((prev) => {
      const f = { ...(prev.functional || {}) };
      if (value === '') delete f[key];
      else f[key] = value;
      return { ...prev, functional: f };
    });
  };

  // Track which dermatomes/myotomes user has expanded ("show abnormal" pattern)
  const sensation = (st.neurological?.sensation as Record<string, string>) || {};
  const strength = (st.neurological?.muscle_strength as Record<string, string>) || {};

  return (
    <div className="space-y-6">
      <SectionTitle>Special Tests</SectionTitle>

      {/* A) Orthopedic Tests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-800">A. Orthopedic Tests</h4>
          <button
            type="button"
            onClick={addOrtho}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#14507c] border border-[#14507c] rounded-md px-3 py-1.5 hover:bg-blue-50"
          >
            <Plus size={14} /> Add Test
          </button>
        </div>

        {ortho.length === 0 ? (
          <p className="text-xs text-gray-400 italic">No tests added. Click "Add Test" to begin.</p>
        ) : (
          <div className="space-y-2">
            {ortho.map((t, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-50 rounded-md p-3"
              >
                <div className="sm:col-span-4">
                  <select
                    value={ORTHO_TEST_OPTIONS.includes(t.test_name) ? t.test_name : (t.test_name ? 'Other (custom)' : '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Other (custom)') {
                        updateOrthoRow(idx, { test_name: '' });
                      } else {
                        updateOrthoRow(idx, { test_name: val });
                      }
                    }}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] bg-white min-h-[40px]"
                  >
                    <option value="">Select test…</option>
                    {ORTHO_TEST_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {(!ORTHO_TEST_OPTIONS.includes(t.test_name) && t.test_name !== '') && (
                    <input
                      type="text"
                      value={t.test_name}
                      onChange={(e) => updateOrthoRow(idx, { test_name: e.target.value })}
                      placeholder="Custom test name"
                      className="mt-1 w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] min-h-[40px]"
                    />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={t.side}
                    onChange={(e) => updateOrthoRow(idx, { side: e.target.value as TestSide })}
                    className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] bg-white min-h-[40px]"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="bilateral">Bilateral</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={t.result}
                    onChange={(e) => updateOrthoRow(idx, { result: e.target.value as TestResult })}
                    className={`w-full px-2 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] bg-white min-h-[40px] ${
                      t.result === 'positive'
                        ? 'border-red-300 text-red-700'
                        : t.result === 'negative'
                          ? 'border-green-300 text-green-700'
                          : 'border-amber-300 text-amber-700'
                    }`}
                  >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="inconclusive">Inconclusive</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={t.notes || ''}
                    onChange={(e) => updateOrthoRow(idx, { notes: e.target.value })}
                    placeholder="Notes…"
                    className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] min-h-[40px]"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeOrtho(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    aria-label="Remove test"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* B) Neurological Screen */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-800">B. Neurological Screen</h4>

        {/* Reflexes */}
        <div>
          <Label>Reflexes</Label>
          <p className="text-xs text-gray-500 mb-2">Grade: 0 (absent) → 4+ (clonus). Leave blank if normal.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REFLEX_TARGETS.map((target) => (
              <div key={target} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 min-w-[120px]">{target}</span>
                <select
                  value={(st.neurological?.reflexes as Record<string, string>)?.[target] || ''}
                  onChange={(e) => updateNeuro('reflexes', target, e.target.value)}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] bg-white min-h-[40px]"
                >
                  <option value="">—</option>
                  {REFLEX_GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Sensation (per dermatome) */}
        <DermatomeSection
          sensation={sensation}
          onUpdate={(key, value) => updateNeuro('sensation', key, value)}
        />

        {/* Muscle strength (per myotome) */}
        <MyotomeSection
          strength={strength}
          onUpdate={(key, value) => updateNeuro('muscle_strength', key, value)}
        />
      </div>

      {/* C) Functional Assessment */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-800">C. Functional Assessment</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="balance_r">Single Leg Stand — Right (sec)</Label>
            <Input
              id="balance_r"
              type="number"
              value={(st.functional?.balance_right as string) || ''}
              onChange={(v) => updateFunctional('balance_right', v)}
              placeholder="seconds"
            />
          </div>
          <div>
            <Label htmlFor="balance_l">Single Leg Stand — Left (sec)</Label>
            <Input
              id="balance_l"
              type="number"
              value={(st.functional?.balance_left as string) || ''}
              onChange={(v) => updateFunctional('balance_left', v)}
              placeholder="seconds"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="gait">Gait Observations</Label>
            <TextArea
              id="gait"
              value={(st.functional?.gait as string) || ''}
              onChange={(v) => updateFunctional('gait', v)}
              placeholder="Stride length, antalgic gait, trendelenburg, foot drop…"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="sts">Sit-to-Stand × 5 (sec)</Label>
            <Input
              id="sts"
              type="number"
              value={(st.functional?.sit_to_stand as string) || ''}
              onChange={(v) => updateFunctional('sit_to_stand', v)}
              placeholder="seconds"
            />
          </div>
          <div>
            <Label htmlFor="reach">Functional Reach (cm)</Label>
            <Input
              id="reach"
              type="number"
              value={(st.functional?.functional_reach as string) || ''}
              onChange={(v) => updateFunctional('functional_reach', v)}
              placeholder="cm"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="other_func">Other Functional Notes</Label>
            <TextArea
              id="other_func"
              value={(st.functional?.other as string) || ''}
              onChange={(v) => updateFunctional('other', v)}
              placeholder="Other observations…"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Overall notes */}
      <div className="pt-2 border-t border-gray-100">
        <Label htmlFor="st_notes">Special Tests Summary / Notes</Label>
        <TextArea
          id="st_notes"
          value={st.notes || ''}
          onChange={(v) => updateSpecialTests((prev) => ({ ...prev, notes: v }))}
          placeholder="Overall summary of special tests findings…"
          rows={3}
        />
      </div>
    </div>
  );
}

function DermatomeSection({
  sensation,
  onUpdate,
}: {
  sensation: Record<string, string>;
  onUpdate: (key: string, value: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  // Compute which dermatomes have any non-normal entry
  const abnormalKeys = Object.keys(sensation).filter((k) => sensation[k] && sensation[k] !== 'Normal');
  const dermatomesToShow = showAll ? DERMATOMES : DERMATOMES.filter((d) =>
    SENSATION_MODES.some((mode) => abnormalKeys.includes(`${d}__${mode}`))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Sensation (per dermatome)</Label>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-xs text-[#14507c] hover:underline"
        >
          {showAll ? 'Hide normal' : `Show all ${DERMATOMES.length} dermatomes`}
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-2">
        Default: dermatomes are assumed normal. Add entries only for abnormal findings.
      </p>

      {!showAll && dermatomesToShow.length === 0 && (
        <p className="text-xs text-gray-400 italic">All dermatomes presumed normal. Click "Show all" to record findings.</p>
      )}

      {dermatomesToShow.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-2 font-medium text-gray-600 border border-gray-200 text-xs">Dermatome</th>
                {SENSATION_MODES.map((mode) => (
                  <th key={mode} className="text-left py-2 px-2 font-medium text-gray-600 border border-gray-200 text-xs">{mode}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dermatomesToShow.map((d) => (
                <tr key={d}>
                  <td className="py-1 px-2 font-medium text-gray-800 border border-gray-200">{d}</td>
                  {SENSATION_MODES.map((mode) => {
                    const k = `${d}__${mode}`;
                    return (
                      <td key={mode} className="py-1 px-1 border border-gray-200">
                        <select
                          value={sensation[k] || ''}
                          onChange={(e) => onUpdate(k, e.target.value)}
                          className="w-full px-1 py-1.5 text-xs border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#14507c] rounded min-h-[36px]"
                        >
                          <option value="">—</option>
                          {SENSATION_GRADES.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MyotomeSection({
  strength,
  onUpdate,
}: {
  strength: Record<string, string>;
  onUpdate: (key: string, value: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const abnormalKeys = Object.keys(strength).filter((k) => strength[k] && strength[k] !== '5');
  const myotomesToShow = showAll ? MYOTOMES : MYOTOMES.filter((m) =>
    abnormalKeys.includes(`${m.key}__R`) || abnormalKeys.includes(`${m.key}__L`)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>Muscle Strength (MMT 0-5, per myotome)</Label>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-xs text-[#14507c] hover:underline"
        >
          {showAll ? 'Hide normal' : `Show all ${MYOTOMES.length} myotomes`}
        </button>
      </div>
      <p className="text-xs text-gray-500 mb-2">
        Default: muscle strength assumed 5/5. Add entries only for graded findings.
      </p>

      {!showAll && myotomesToShow.length === 0 && (
        <p className="text-xs text-gray-400 italic">All myotomes presumed 5/5. Click "Show all" to record findings.</p>
      )}

      {myotomesToShow.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-2 font-medium text-gray-600 border border-gray-200 text-xs">Myotome</th>
                <th className="text-left py-2 px-2 font-medium text-gray-600 border border-gray-200 text-xs">Right</th>
                <th className="text-left py-2 px-2 font-medium text-gray-600 border border-gray-200 text-xs">Left</th>
              </tr>
            </thead>
            <tbody>
              {myotomesToShow.map((m) => (
                <tr key={m.key}>
                  <td className="py-1 px-2 font-medium text-gray-800 border border-gray-200 text-xs">{m.label}</td>
                  {(['R', 'L'] as const).map((side) => {
                    const k = `${m.key}__${side}`;
                    return (
                      <td key={side} className="py-1 px-1 border border-gray-200">
                        <select
                          value={strength[k] || ''}
                          onChange={(e) => onUpdate(k, e.target.value)}
                          className="w-full px-1 py-1.5 text-xs border-0 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#14507c] rounded min-h-[36px]"
                        >
                          <option value="">—</option>
                          {MMT_GRADES.map((g) => (
                            <option key={g} value={g}>{g}/5</option>
                          ))}
                        </select>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── STEP 8: Goals ─────────────────────────────────────────────────────────

function StepGoals({
  form,
  updateGoals,
}: {
  form: AssessmentFormData;
  updateGoals: (u: (prev: PatientGoals) => PatientGoals) => void;
}) {
  const g = form.goals;
  const updateGoal = (
    field: 'short_term_goals' | 'long_term_goals',
    index: number,
    value: string,
  ) => {
    updateGoals((prev) => {
      const goals = [...(prev[field] || ['', '', ''])];
      goals[index] = value;
      return { ...prev, [field]: goals };
    });
  };

  return (
    <div className="space-y-5">
      <SectionTitle>Goals</SectionTitle>

      <div>
        <Label>Short-term Goals (4-6 weeks)</Label>
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-2">
            <Input
              value={(g.short_term_goals || ['', '', ''])[i] || ''}
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
              value={(g.long_term_goals || ['', '', ''])[i] || ''}
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
          value={g.patient_own_goals || ''}
          onChange={(v) => updateGoals((prev) => ({ ...prev, patient_own_goals: v }))}
          placeholder="What the patient wants to achieve in their own words…"
          rows={3}
        />
      </div>
    </div>
  );
}

// ─── STEP 9: Treatment Plan (NEW) ──────────────────────────────────────────

function StepTreatmentPlan({
  form,
  updateTreatmentPlan,
  signedConsent,
  setSignedConsent,
  signatureName,
  setSignatureName,
  assessor,
  updateAssessor,
  onComplete,
  saving,
}: {
  form: AssessmentFormData;
  updateTreatmentPlan: (u: (prev: PatientTreatmentPlan) => PatientTreatmentPlan) => void;
  signedConsent: boolean;
  setSignedConsent: (v: boolean) => void;
  signatureName: string;
  setSignatureName: (v: string) => void;
  assessor: string;
  updateAssessor: (v: string) => void;
  onComplete: () => void;
  saving: boolean;
}) {
  const tp = form.treatment_plan;

  // Derive whether "Other" modality is in use, and its custom value (anything not in MODALITY_OPTIONS)
  const customModalities = (tp.modalities || []).filter((m) => !MODALITY_OPTIONS.includes(m));
  const [customModalityInput, setCustomModalityInput] = useState(customModalities.join(', '));
  const [otherEnabled, setOtherEnabled] = useState(customModalities.length > 0);

  const toggleModality = (mod: string) => {
    updateTreatmentPlan((prev) => {
      const list = prev.modalities || [];
      const updated = list.includes(mod)
        ? list.filter((m) => m !== mod)
        : [...list, mod];
      return { ...prev, modalities: updated };
    });
  };

  const toggleManual = (m: string) => {
    updateTreatmentPlan((prev) => {
      const list = prev.manual_therapy || [];
      const updated = list.includes(m) ? list.filter((x) => x !== m) : [...list, m];
      return { ...prev, manual_therapy: updated };
    });
  };

  const setCustomModalityList = (raw: string) => {
    setCustomModalityInput(raw);
    const customs = raw.split(',').map((s) => s.trim()).filter(Boolean);
    updateTreatmentPlan((prev) => {
      const standard = (prev.modalities || []).filter((m) => MODALITY_OPTIONS.includes(m));
      return { ...prev, modalities: [...standard, ...customs] };
    });
  };

  const addExercise = () => {
    updateTreatmentPlan((prev) => ({
      ...prev,
      exercises: [
        ...(prev.exercises || []),
        { name: '', sets: undefined, reps: '', frequency: '', notes: '' },
      ],
    }));
  };

  const updateExercise = (idx: number, patch: Partial<PrescribedExercise>) => {
    updateTreatmentPlan((prev) => {
      const list = [...(prev.exercises || [])];
      list[idx] = { ...list[idx], ...patch };
      return { ...prev, exercises: list };
    });
  };

  const removeExercise = (idx: number) => {
    updateTreatmentPlan((prev) => {
      const list = [...(prev.exercises || [])];
      list.splice(idx, 1);
      return { ...prev, exercises: list };
    });
  };

  const standardSelected = (tp.modalities || []).filter((m) => MODALITY_OPTIONS.includes(m));

  return (
    <div className="space-y-5">
      <SectionTitle>Treatment Plan & Consent</SectionTitle>

      {/* Modalities */}
      <div>
        <Label>Modalities</Label>
        <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
        <CheckboxGroup
          selected={standardSelected}
          onToggle={toggleModality}
          options={MODALITY_OPTIONS}
        />
        <div className="mt-2 flex items-center gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={otherEnabled}
              onChange={(e) => {
                setOtherEnabled(e.target.checked);
                if (!e.target.checked) {
                  setCustomModalityInput('');
                  updateTreatmentPlan((prev) => ({
                    ...prev,
                    modalities: (prev.modalities || []).filter((m) => MODALITY_OPTIONS.includes(m)),
                  }));
                }
              }}
              className="w-4 h-4 rounded border-gray-300 text-[#14507c] focus:ring-[#14507c]"
            />
            <span className="text-sm text-gray-700">Other</span>
          </label>
          {otherEnabled && (
            <input
              type="text"
              value={customModalityInput}
              onChange={(e) => setCustomModalityList(e.target.value)}
              placeholder="Comma-separated custom modalities"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] min-h-[40px]"
            />
          )}
        </div>
      </div>

      {/* Manual therapy */}
      <div>
        <Label>Manual Therapy</Label>
        <CheckboxGroup
          selected={tp.manual_therapy || []}
          onToggle={toggleManual}
          options={MANUAL_THERAPY_OPTIONS}
        />
      </div>

      {/* Exercises prescribed */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Exercises Prescribed</Label>
          <button
            type="button"
            onClick={addExercise}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#14507c] border border-[#14507c] rounded-md px-3 py-1.5 hover:bg-blue-50"
          >
            <Plus size={14} /> Add Exercise
          </button>
        </div>
        {(tp.exercises || []).length === 0 ? (
          <p className="text-xs text-gray-400 italic">No exercises added.</p>
        ) : (
          <div className="space-y-2">
            {(tp.exercises || []).map((ex, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-50 rounded-md p-3"
              >
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => updateExercise(idx, { name: e.target.value })}
                  placeholder="Exercise name"
                  className="sm:col-span-3 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] min-h-[40px]"
                />
                <input
                  type="number"
                  value={ex.sets ?? ''}
                  onChange={(e) =>
                    updateExercise(idx, {
                      sets: e.target.value === '' ? undefined : parseInt(e.target.value),
                    })
                  }
                  placeholder="Sets"
                  className="sm:col-span-1 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] min-h-[40px]"
                />
                <input
                  type="text"
                  value={(ex.reps as string | number | undefined)?.toString() ?? ''}
                  onChange={(e) => updateExercise(idx, { reps: e.target.value })}
                  placeholder="Reps"
                  className="sm:col-span-2 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] min-h-[40px]"
                />
                <input
                  type="text"
                  value={ex.frequency || ''}
                  onChange={(e) => updateExercise(idx, { frequency: e.target.value })}
                  placeholder="e.g. 3x/day"
                  className="sm:col-span-2 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] min-h-[40px]"
                />
                <input
                  type="text"
                  value={ex.notes || ''}
                  onChange={(e) => updateExercise(idx, { notes: e.target.value })}
                  placeholder="Notes"
                  className="sm:col-span-3 px-2 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] min-h-[40px]"
                />
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeExercise(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    aria-label="Remove exercise"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Home program */}
      <div>
        <Label htmlFor="home_program">Home Program</Label>
        <TextArea
          id="home_program"
          value={tp.home_program || ''}
          onChange={(v) => updateTreatmentPlan((prev) => ({ ...prev, home_program: v }))}
          placeholder="Detailed home exercise/care plan…"
          rows={3}
        />
      </div>

      {/* Frequency / duration / follow-up */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="freq_week">Frequency / week</Label>
          <Input
            id="freq_week"
            type="number"
            value={tp.frequency_per_week ?? ''}
            onChange={(v) =>
              updateTreatmentPlan((prev) => ({
                ...prev,
                frequency_per_week: v === '' ? undefined : parseInt(v),
              }))
            }
            placeholder="e.g. 3"
          />
        </div>
        <div>
          <Label htmlFor="dur_weeks">Duration (weeks)</Label>
          <Input
            id="dur_weeks"
            type="number"
            value={tp.duration_weeks ?? ''}
            onChange={(v) =>
              updateTreatmentPlan((prev) => ({
                ...prev,
                duration_weeks: v === '' ? undefined : parseInt(v),
              }))
            }
            placeholder="e.g. 6"
          />
        </div>
        <div>
          <Label htmlFor="followup">Follow-up Date</Label>
          <Input
            id="followup"
            type="date"
            value={tp.follow_up_date || ''}
            onChange={(v) => updateTreatmentPlan((prev) => ({ ...prev, follow_up_date: v }))}
          />
        </div>
      </div>

      {/* Precautions */}
      <div>
        <Label htmlFor="precautions">Precautions</Label>
        <TextArea
          id="precautions"
          value={tp.precautions || ''}
          onChange={(v) => updateTreatmentPlan((prev) => ({ ...prev, precautions: v }))}
          placeholder="Contraindications, things to avoid…"
          rows={2}
        />
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="tp_notes">Treatment Notes</Label>
        <TextArea
          id="tp_notes"
          value={tp.notes || ''}
          onChange={(v) => updateTreatmentPlan((prev) => ({ ...prev, notes: v }))}
          placeholder="Additional notes…"
          rows={3}
        />
      </div>

      {/* Consent */}
      <div className="border-t border-gray-200 pt-5 space-y-4">
        <h4 className="text-sm font-semibold text-gray-800">Consent & Signature</h4>

        <div>
          <Label htmlFor="assessor_name">Assessor Name</Label>
          <Input
            id="assessor_name"
            value={assessor}
            onChange={updateAssessor}
            placeholder="Therapist name"
          />
        </div>

        <div>
          <Label htmlFor="signature">Patient Signature (type full name)</Label>
          <Input
            id="signature"
            value={signatureName}
            onChange={setSignatureName}
            placeholder="Patient types their full name as signature"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={signedConsent}
            onChange={(e) => setSignedConsent(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#14507c] focus:ring-[#14507c]"
          />
          <span className="text-sm text-gray-700">
            I have explained the assessment findings and treatment plan to the patient.
            The patient understands and consents to the proposed plan.
          </span>
        </label>
      </div>

      <button
        onClick={onComplete}
        disabled={saving || !signedConsent || !signatureName.trim()}
        className="w-full py-3 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
      >
        {saving ? 'Completing…' : 'Complete & Save Assessment'}
      </button>

      {(!signedConsent || !signatureName.trim()) && (
        <p className="text-xs text-amber-600 text-center">
          Consent checkbox and patient signature are required to complete the assessment.
        </p>
      )}
    </div>
  );
}
