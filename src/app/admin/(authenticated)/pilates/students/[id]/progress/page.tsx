'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { PilatesRegistration, PilatesBatch, PilatesAssessment } from '@/types/pilates';

const STEPS = [
  { id: 1, label: 'Pain Re-assessment' },
  { id: 2, label: 'APPI Re-assessment' },
  { id: 3, label: 'Exercise Competency' },
  { id: 4, label: 'Outcome Measures' },
  { id: 5, label: 'Progression Decision' },
  { id: 6, label: 'Notes & Review' },
];

const APPI_ELEMENTS = [
  { key: 'breathing', label: 'Breathing Pattern' },
  { key: 'centering', label: 'Centering / Core Activation' },
  { key: 'ribcage', label: 'Rib Cage Placement' },
  { key: 'shoulder', label: 'Shoulder Organization' },
  { key: 'head_neck', label: 'Head & Neck Placement' },
  { key: 'double_tabletop', label: 'Double Tabletop Hold' },
];

const COMPETENCY_EXERCISES = [
  { key: 'breathing_pattern', label: 'Breathing Pattern' },
  { key: 'pelvic_floor', label: 'Pelvic Floor Activation' },
  { key: 'curl_up', label: 'Curl Up' },
  { key: 'bridging', label: 'Bridging' },
  { key: 'single_leg_stretch', label: 'Single Leg Stretch' },
  { key: 'swimming', label: 'Swimming' },
  { key: 'plank', label: 'Plank' },
  { key: 'side_lying', label: 'Side Lying Series' },
  { key: 'roll_up', label: 'Roll Up' },
];

const COMPETENCY_CRITERIA = ['form', 'control', 'endurance'];

export default function ProgressAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<PilatesRegistration | null>(null);
  const [batches, setBatches] = useState<PilatesBatch[]>([]);
  const [initialAssessment, setInitialAssessment] = useState<PilatesAssessment | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
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

    const [{ data: regData }, { data: batchData }, { data: initialData }, { data: draftData }] =
      await Promise.all([
        supabase.from('pilates_registrations').select('*').eq('id', studentId).single(),
        supabase.from('pilates_batches').select('*').eq('is_active', true).order('name'),
        supabase
          .from('pilates_assessments')
          .select('*')
          .eq('student_id', studentId)
          .eq('type', 'initial')
          .eq('consent_given', true)
          .order('assessment_date', { ascending: false })
          .limit(1),
        supabase
          .from('pilates_assessments')
          .select('*')
          .eq('student_id', studentId)
          .eq('type', 'progress')
          .eq('consent_given', false)
          .order('created_at', { ascending: false })
          .limit(1),
      ]);

    if (regData) setStudent(regData as PilatesRegistration);
    setBatches(batchData || []);

    const initial = initialData?.[0] as PilatesAssessment | undefined;
    if (initial) setInitialAssessment(initial);

    // Resume draft or start fresh
    if (draftData && draftData.length > 0) {
      const draft = draftData[0] as PilatesAssessment;
      setDraftId(draft.id);
      setForm(draft as unknown as Record<string, unknown>);
    } else {
      setForm({
        student_id: studentId,
        type: 'progress',
        assessment_date: new Date().toISOString().split('T')[0],
        assessor_name: 'Dr. Shiva Jain Sangoi',
        session_number: null,
        current_level: initial?.starting_level || '',
        weeks_at_level: null,
        pain_location: initial?.pain_location || '',
        pain_vas: 0,
        pain_nature: [],
        pain_frequency: '',
        pain_aggravating: '',
        pain_easing: '',
        appi_reassessment: {},
        exercise_competency: {},
        outcome_measures: {
          pain_vas_initial: String(initial?.pain_vas ?? ''),
          pain_vas_current: '',
          balance_initial: '',
          balance_current: '',
          core_hold_initial: '',
          core_hold_current: '',
        },
        client_satisfaction: '',
        progression_decision: '',
        next_level: '',
        repeat_weeks: null,
        modify_details: '',
        therapist_notes: '',
        next_review_date: '',
        consent_given: false,
        client_signature: '',
      });
    }

    setLoading(false);
  };

  const updateForm = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveDraft = async () => {
    setSaving(true);
    const supabase = createClient();

    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    };

    if (draftId) {
      const { error } = await supabase
        .from('pilates_assessments')
        .update(payload)
        .eq('id', draftId);
      if (error) setToast({ message: 'Failed to save draft', type: 'error' });
      else setToast({ message: 'Draft saved', type: 'success' });
    } else {
      const { data, error } = await supabase
        .from('pilates_assessments')
        .insert(payload)
        .select('id')
        .single();
      if (error) setToast({ message: 'Failed to save draft', type: 'error' });
      else {
        setDraftId(data.id);
        setToast({ message: 'Draft saved', type: 'success' });
      }
    }

    setSaving(false);
  };

  const completeAssessment = async () => {
    if (!(form.assessor_name as string)?.trim()) {
      setToast({ message: 'Assessor name is required', type: 'error' });
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const payload = {
      ...form,
      consent_given: true,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (draftId) {
      ({ error } = await supabase.from('pilates_assessments').update(payload).eq('id', draftId));
    } else {
      ({ error } = await supabase.from('pilates_assessments').insert(payload));
    }

    if (error) {
      setToast({ message: 'Failed to complete assessment', type: 'error' });
    } else {
      setToast({ message: 'Progress assessment completed!', type: 'success' });
      setTimeout(() => router.push(`/admin/pilates/students/${studentId}`), 1000);
    }

    setSaving(false);
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
    return <div className="text-center py-12 text-gray-500">Student not found.</div>;
  }

  if (!initialAssessment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No initial assessment found. Complete an initial assessment first.</p>
        <button
          onClick={() => router.push(`/admin/pilates/students/${studentId}`)}
          className="text-[#14507c] hover:underline text-sm"
        >
          Back to Student Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
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
          <h2 className="text-xl font-semibold text-gray-800 normal-case">Progress Assessment</h2>
          <p className="text-sm text-gray-500">{student.name} &middot; {student.phone}</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentStep === step.id
                  ? 'bg-[#14507c] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                currentStep === step.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
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
          <ProgressStepPain form={form} updateForm={updateForm} initial={initialAssessment} />
        )}
        {currentStep === 2 && (
          <ProgressStepAPPI form={form} updateForm={updateForm} initial={initialAssessment} />
        )}
        {currentStep === 3 && (
          <ProgressStepCompetency form={form} updateForm={updateForm} />
        )}
        {currentStep === 4 && (
          <ProgressStepOutcomes form={form} updateForm={updateForm} initial={initialAssessment} />
        )}
        {currentStep === 5 && (
          <ProgressStepDecision form={form} updateForm={updateForm} batches={batches} />
        )}
        {currentStep === 6 && (
          <ProgressStepNotes
            form={form}
            updateForm={updateForm}
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

        {currentStep < 6 ? (
          <button
            onClick={() => setCurrentStep((s) => Math.min(6, s + 1))}
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

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
      {children}
    </h3>
  );
}

function CompareValue({ label, initial, current }: { label: string; initial: string; current?: string }) {
  return (
    <div className="bg-gray-50 rounded-md p-3 text-sm">
      <span className="text-gray-500 text-xs block">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-gray-400 line-through">{initial || '-'}</span>
        {current !== undefined && (
          <>
            <span className="text-gray-400">&rarr;</span>
            <span className="font-medium text-gray-800">{current || '-'}</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── STEP COMPONENTS ─────────────────────────────────────────────────────────

function ProgressStepPain({
  form,
  updateForm,
  initial,
}: {
  form: Record<string, unknown>;
  updateForm: (f: string, v: unknown) => void;
  initial: PilatesAssessment;
}) {
  const painNature = (form.pain_nature as string[]) || [];

  return (
    <div className="space-y-5">
      <SectionTitle>Pain Re-assessment</SectionTitle>

      {/* Initial values for reference */}
      <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
        <p className="text-xs font-medium text-blue-700 mb-2 uppercase">Initial Assessment Values</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="text-blue-600 text-xs">Pain Location</span>
            <p className="font-medium text-blue-900">{initial.pain_location || '-'}</p>
          </div>
          <div>
            <span className="text-blue-600 text-xs">VAS Score</span>
            <p className="font-medium text-blue-900">{initial.pain_vas ?? '-'}/10</p>
          </div>
          <div>
            <span className="text-blue-600 text-xs">Frequency</span>
            <p className="font-medium text-blue-900 capitalize">{initial.pain_frequency || '-'}</p>
          </div>
          <div>
            <span className="text-blue-600 text-xs">Nature</span>
            <p className="font-medium text-blue-900">{(initial.pain_nature || []).join(', ') || '-'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Assessment Date</Label>
          <input
            type="date"
            value={(form.assessment_date as string) || ''}
            onChange={(e) => updateForm('assessment_date', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
          />
        </div>
        <div>
          <Label>Session Number</Label>
          <input
            type="number"
            value={(form.session_number as number) || ''}
            onChange={(e) => updateForm('session_number', parseInt(e.target.value) || null)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
            placeholder="e.g. 12"
          />
        </div>
      </div>

      <div>
        <Label>Pain Location (Current)</Label>
        <input
          type="text"
          value={(form.pain_location as string) || ''}
          onChange={(e) => updateForm('pain_location', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
          placeholder="Current pain location..."
        />
      </div>

      <div>
        <Label>Current Pain Intensity (VAS 0-10)</Label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={10}
            value={(form.pain_vas as number) || 0}
            onChange={(e) => updateForm('pain_vas', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#14507c]"
          />
          <span className={`text-2xl font-bold min-w-[2ch] text-center ${
            ((form.pain_vas as number) || 0) <= 3
              ? 'text-green-600'
              : ((form.pain_vas as number) || 0) <= 6
                ? 'text-amber-600'
                : 'text-red-600'
          }`}>
            {(form.pain_vas as number) || 0}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>No pain</span>
          <span>Worst pain</span>
        </div>
        {initial.pain_vas !== undefined && (
          <p className="text-xs text-gray-500 mt-1">
            Initial VAS: {initial.pain_vas}/10 | Change: {((form.pain_vas as number) || 0) - initial.pain_vas}
          </p>
        )}
      </div>

      <div>
        <Label>Pain Nature</Label>
        <div className="flex flex-wrap gap-2">
          {['Sharp', 'Dull', 'Burning', 'Aching', 'Shooting', 'Throbbing', 'Stabbing'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                const updated = painNature.includes(opt)
                  ? painNature.filter((n) => n !== opt)
                  : [...painNature, opt];
                updateForm('pain_nature', updated);
              }}
              className={`px-3 py-2 text-sm rounded-md border transition-colors min-h-[44px] ${
                painNature.includes(opt)
                  ? 'border-[#14507c] bg-blue-50 text-[#14507c] font-medium'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Pain Frequency</Label>
        <div className="flex gap-2">
          {['constant', 'intermittent'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateForm('pain_frequency', opt)}
              className={`px-4 py-2.5 text-sm rounded-md border font-medium transition-colors min-h-[44px] capitalize ${
                form.pain_frequency === opt
                  ? 'border-[#14507c] bg-[#14507c] text-white'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Aggravating Factors</Label>
        <textarea
          value={(form.pain_aggravating as string) || ''}
          onChange={(e) => updateForm('pain_aggravating', e.target.value)}
          rows={2}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
          placeholder="What makes it worse now..."
        />
      </div>

      <div>
        <Label>Easing Factors</Label>
        <textarea
          value={(form.pain_easing as string) || ''}
          onChange={(e) => updateForm('pain_easing', e.target.value)}
          rows={2}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
          placeholder="What makes it better now..."
        />
      </div>
    </div>
  );
}

function ProgressStepAPPI({
  form,
  updateForm,
  initial,
}: {
  form: Record<string, unknown>;
  updateForm: (f: string, v: unknown) => void;
  initial: PilatesAssessment;
}) {
  const appi = (form.appi_reassessment as Record<string, Record<string, string>>) || {};
  const initialAppi = initial.appi_elements || {};

  return (
    <div className="space-y-5">
      <SectionTitle>APPI Re-assessment</SectionTitle>
      <p className="text-sm text-gray-500 -mt-2">Compare current findings with initial assessment</p>

      <div className="space-y-4">
        {APPI_ELEMENTS.map((el) => {
          const current = appi[el.key] || { rating: '', notes: '' };
          const initialVal = (initialAppi as Record<string, { rating: string; notes: string }>)[el.key];

          return (
            <div key={el.key} className="bg-gray-50 rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-800">{el.label}</h4>
                {initialVal && (
                  <span className="text-xs text-gray-500">
                    Initial: <span className="font-medium capitalize">{initialVal.rating?.replace('_', ' ') || '-'}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {['unable', 'with_cues', 'independent'].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => {
                      const updated = { ...appi, [el.key]: { ...current, rating } };
                      updateForm('appi_reassessment', updated);
                    }}
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
                onChange={(e) => {
                  const updated = { ...appi, [el.key]: { ...current, notes: e.target.value } };
                  updateForm('appi_reassessment', updated);
                }}
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

function ProgressStepCompetency({
  form,
  updateForm,
}: {
  form: Record<string, unknown>;
  updateForm: (f: string, v: unknown) => void;
}) {
  const competency = (form.exercise_competency as Record<string, Record<string, string>>) || {};

  const updateCompetency = (exercise: string, criterion: string, value: string) => {
    const updated = {
      ...competency,
      [exercise]: {
        ...(competency[exercise] || {}),
        [criterion]: value,
      },
    };
    updateForm('exercise_competency', updated);
  };

  const isPass = (exercise: string) => {
    const ex = competency[exercise];
    if (!ex) return false;
    return COMPETENCY_CRITERIA.every((c) => ex[c] === 'good');
  };

  return (
    <div className="space-y-5">
      <SectionTitle>Exercise Competency</SectionTitle>
      <p className="text-sm text-gray-500 -mt-2">
        Rate each exercise for form, control, and endurance. All &quot;Good&quot; = Pass.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-2 px-3 font-medium text-gray-600 border border-gray-200">Exercise</th>
              {COMPETENCY_CRITERIA.map((c) => (
                <th key={c} className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200 capitalize">
                  {c}
                </th>
              ))}
              <th className="text-center py-2 px-3 font-medium text-gray-600 border border-gray-200">Pass</th>
            </tr>
          </thead>
          <tbody>
            {COMPETENCY_EXERCISES.map((ex) => (
              <tr key={ex.key}>
                <td className="py-2 px-3 font-medium text-gray-800 border border-gray-200">{ex.label}</td>
                {COMPETENCY_CRITERIA.map((criterion) => (
                  <td key={criterion} className="py-1 px-1 border border-gray-200">
                    <div className="flex justify-center gap-1">
                      {['good', 'fair', 'poor'].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => updateCompetency(ex.key, criterion, rating)}
                          className={`px-2 py-1.5 text-[10px] rounded border font-medium transition-colors min-h-[36px] min-w-[36px] capitalize ${
                            competency[ex.key]?.[criterion] === rating
                              ? rating === 'good'
                                ? 'border-green-400 bg-green-50 text-green-700'
                                : rating === 'fair'
                                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                                  : 'border-red-400 bg-red-50 text-red-700'
                              : 'border-gray-200 text-gray-400 hover:border-gray-400'
                          }`}
                        >
                          {rating[0].toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </td>
                ))}
                <td className="py-2 px-3 text-center border border-gray-200">
                  {isPass(ex.key) ? (
                    <span className="text-green-600 font-bold">&#10003;</span>
                  ) : (
                    <span className="text-gray-300">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProgressStepOutcomes({
  form,
  updateForm,
  initial,
}: {
  form: Record<string, unknown>;
  updateForm: (f: string, v: unknown) => void;
  initial: PilatesAssessment;
}) {
  const measures = (form.outcome_measures as Record<string, string>) || {};

  const updateMeasure = (key: string, value: string) => {
    updateForm('outcome_measures', { ...measures, [key]: value });
  };

  return (
    <div className="space-y-5">
      <SectionTitle>Outcome Measures</SectionTitle>

      <div className="grid grid-cols-1 gap-4">
        {/* Pain VAS comparison */}
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-3">Pain VAS Score</h4>
          <div className="grid grid-cols-2 gap-4">
            <CompareValue label="Initial" initial={String(initial.pain_vas ?? '-')} />
            <div>
              <label className="text-xs text-gray-500 block mb-1">Current</label>
              <input
                type="number"
                min={0}
                max={10}
                value={measures.pain_vas_current || ''}
                onChange={(e) => updateMeasure('pain_vas_current', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
                placeholder="0-10"
              />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-3">Single Leg Balance (seconds)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Initial</label>
              <input
                type="text"
                value={measures.balance_initial || ''}
                onChange={(e) => updateMeasure('balance_initial', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
                placeholder="seconds"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Current</label>
              <input
                type="text"
                value={measures.balance_current || ''}
                onChange={(e) => updateMeasure('balance_current', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
                placeholder="seconds"
              />
            </div>
          </div>
        </div>

        {/* Core Hold */}
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-3">Core Hold Time (seconds)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Initial</label>
              <input
                type="text"
                value={measures.core_hold_initial || ''}
                onChange={(e) => updateMeasure('core_hold_initial', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
                placeholder="seconds"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Current</label>
              <input
                type="text"
                value={measures.core_hold_current || ''}
                onChange={(e) => updateMeasure('core_hold_current', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
                placeholder="seconds"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>Client Satisfaction</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'very_happy', label: 'Very Happy', color: 'green' },
            { value: 'happy', label: 'Happy', color: 'green' },
            { value: 'neutral', label: 'Neutral', color: 'amber' },
            { value: 'needs_improvement', label: 'Needs Improvement', color: 'red' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateForm('client_satisfaction', opt.value)}
              className={`px-4 py-2.5 text-sm rounded-md border font-medium transition-colors min-h-[44px] ${
                form.client_satisfaction === opt.value
                  ? `border-${opt.color}-400 bg-${opt.color}-50 text-${opt.color}-700`
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressStepDecision({
  form,
  updateForm,
  batches,
}: {
  form: Record<string, unknown>;
  updateForm: (f: string, v: unknown) => void;
  batches: PilatesBatch[];
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Progression Decision</SectionTitle>

      <div>
        <Label>Current Level</Label>
        <div className="flex flex-wrap gap-2">
          {['rehab', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => updateForm('current_level', level)}
              className={`px-4 py-2.5 text-sm rounded-md border font-medium transition-colors min-h-[44px] capitalize ${
                form.current_level === level
                  ? 'border-[#14507c] bg-[#14507c] text-white'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Weeks at Current Level</Label>
        <input
          type="number"
          value={(form.weeks_at_level as number) || ''}
          onChange={(e) => updateForm('weeks_at_level', parseInt(e.target.value) || null)}
          className="w-full max-w-[200px] px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
          placeholder="e.g. 6"
        />
      </div>

      <div>
        <Label>Decision</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'progress', label: 'Progress to Next Level', icon: '&#8593;' },
            { value: 'repeat', label: 'Repeat Current Level', icon: '&#8635;' },
            { value: 'modify', label: 'Modify Programme', icon: '&#9998;' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateForm('progression_decision', opt.value)}
              className={`px-4 py-2.5 text-sm rounded-md border font-medium transition-colors min-h-[44px] ${
                form.progression_decision === opt.value
                  ? opt.value === 'progress'
                    ? 'border-green-400 bg-green-50 text-green-700'
                    : opt.value === 'repeat'
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-blue-400 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: opt.icon }} /> {opt.label}
            </button>
          ))}
        </div>
      </div>

      {form.progression_decision === 'progress' && (
        <div>
          <Label>Next Level</Label>
          <div className="flex flex-wrap gap-2">
            {['rehab', 'beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => updateForm('next_level', level)}
                className={`px-4 py-2.5 text-sm rounded-md border font-medium transition-colors min-h-[44px] capitalize ${
                  form.next_level === level
                    ? 'border-green-400 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}

      {form.progression_decision === 'repeat' && (
        <div>
          <Label>Repeat for (weeks)</Label>
          <input
            type="number"
            value={(form.repeat_weeks as number) || ''}
            onChange={(e) => updateForm('repeat_weeks', parseInt(e.target.value) || null)}
            className="w-full max-w-[200px] px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
            placeholder="e.g. 4"
          />
        </div>
      )}

      {form.progression_decision === 'modify' && (
        <div>
          <Label>Modification Details</Label>
          <textarea
            value={(form.modify_details as string) || ''}
            onChange={(e) => updateForm('modify_details', e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
            placeholder="Describe the programme modifications..."
          />
        </div>
      )}

      <div>
        <Label>Assigned Batch</Label>
        <select
          value={(form.assigned_batch_id as string) || ''}
          onChange={(e) => updateForm('assigned_batch_id', e.target.value || null)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent bg-white min-h-[44px]"
        >
          <option value="">No change</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} ({b.current_count}/{b.capacity})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ProgressStepNotes({
  form,
  updateForm,
  onComplete,
  saving,
}: {
  form: Record<string, unknown>;
  updateForm: (f: string, v: unknown) => void;
  onComplete: () => void;
  saving: boolean;
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Therapist Notes & Review</SectionTitle>

      <div>
        <Label>Therapist Notes</Label>
        <textarea
          value={(form.therapist_notes as string) || ''}
          onChange={(e) => updateForm('therapist_notes', e.target.value)}
          rows={5}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent resize-none"
          placeholder="Overall observations, recommendations, special considerations..."
        />
      </div>

      <div>
        <Label>Next Review Date</Label>
        <input
          type="date"
          value={(form.next_review_date as string) || ''}
          onChange={(e) => updateForm('next_review_date', e.target.value)}
          className="w-full max-w-[250px] px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
        />
      </div>

      <div>
        <Label>Assessor Name</Label>
        <input
          type="text"
          value={(form.assessor_name as string) || ''}
          onChange={(e) => updateForm('assessor_name', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
          placeholder="Therapist name"
        />
      </div>

      <div className="border-t border-gray-200 pt-5 space-y-4">
        <div>
          <Label>Client Signature (type full name)</Label>
          <input
            type="text"
            value={(form.client_signature as string) || ''}
            onChange={(e) => updateForm('client_signature', e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#14507c] focus:border-transparent min-h-[44px]"
            placeholder="Client types their full name"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={(form.consent_given as boolean) || false}
            onChange={(e) => updateForm('consent_given', e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-[#14507c] focus:ring-[#14507c]"
          />
          <span className="text-sm text-gray-700">
            I have reviewed the progress assessment findings with the client and discussed the recommended programme changes.
          </span>
        </label>
      </div>

      <button
        onClick={onComplete}
        disabled={saving || !(form.consent_given as boolean) || !(form.client_signature as string)?.trim()}
        className="w-full py-3 bg-[#e8899c] text-white text-sm font-medium rounded-md hover:bg-[#d4778a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
      >
        {saving ? 'Completing Assessment...' : 'Complete & Save Progress Assessment'}
      </button>

      {(!(form.consent_given as boolean) || !(form.client_signature as string)?.trim()) && (
        <p className="text-xs text-amber-600 text-center">
          Consent checkbox and client signature are required to complete the assessment.
        </p>
      )}
    </div>
  );
}
