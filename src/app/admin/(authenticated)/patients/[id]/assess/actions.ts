'use server';

/**
 * Server actions for the Patient Assessment form.
 *
 * Auth is enforced via the (authenticated) layout, but we re-check here
 * because server actions can theoretically be invoked outside that route's
 * render path. All writes go through the user's Supabase session, so RLS
 * still applies on top of these checks.
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type {
  PatientClientDetails,
  PatientHistory,
  PatientLifestyle,
  PatientPain,
  PatientPosture,
  PatientROM,
  PatientSpecialTests,
  PatientGoals,
  PatientTreatmentPlan,
} from '@/types/patient';

// ─── TYPES ─────────────────────────────────────────────────────────────────

export interface AssessmentFormData {
  assessment_date: string;
  assessor: string;
  client_details: PatientClientDetails;
  history: PatientHistory;
  lifestyle: PatientLifestyle;
  pain: PatientPain;
  posture: PatientPosture;
  rom: PatientROM;
  special_tests: PatientSpecialTests;
  goals: PatientGoals;
  treatment_plan: PatientTreatmentPlan;
}

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ─── HELPERS ───────────────────────────────────────────────────────────────

function validateBaseFields(form: Partial<AssessmentFormData>): string | null {
  if (!form.assessment_date) return 'assessment_date is required';
  if (!form.assessor || typeof form.assessor !== 'string' || !form.assessor.trim()) {
    return 'assessor is required';
  }
  // Date format check (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.assessment_date)) {
    return 'assessment_date must be ISO date (YYYY-MM-DD)';
  }
  return null;
}

function buildPayload(patientId: string, form: AssessmentFormData) {
  return {
    patient_id: patientId,
    assessment_date: form.assessment_date,
    assessor: form.assessor.trim(),
    client_details: form.client_details ?? {},
    history: form.history ?? {},
    lifestyle: form.lifestyle ?? {},
    pain: form.pain ?? {},
    posture: form.posture ?? {},
    rom: form.rom ?? {},
    special_tests: form.special_tests ?? {},
    goals: form.goals ?? {},
    treatment_plan: form.treatment_plan ?? {},
  };
}

// ─── ACTIONS ───────────────────────────────────────────────────────────────

/**
 * Save (or upsert) a draft assessment. If `assessmentId` is provided, the
 * existing row is updated; otherwise a new draft row is inserted.
 */
export async function saveDraft(
  patientId: string,
  form: AssessmentFormData,
  assessmentId?: string | null,
): Promise<ActionResult<{ id: string }>> {
  if (!patientId) return { ok: false, error: 'patientId is required' };

  const validationError = validateBaseFields(form);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Unauthorized' };

  const payload = {
    ...buildPayload(patientId, form),
    draft: true,
  };

  if (assessmentId) {
    const { data, error } = await supabase
      .from('patient_assessments')
      .update(payload)
      .eq('id', assessmentId)
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/admin/patients/${patientId}`);
    return { ok: true, data: { id: data.id } };
  }

  const { data, error } = await supabase
    .from('patient_assessments')
    .insert(payload)
    .select('id')
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/patients/${patientId}`);
  return { ok: true, data: { id: data.id } };
}

/**
 * Mark an assessment as completed (draft = false, completed_at = now()).
 * Requires consent + signature.
 */
export async function completeAssessment(
  patientId: string,
  assessmentId: string | null,
  form: AssessmentFormData,
  signedConsent: boolean,
  signatureName: string,
): Promise<ActionResult<{ id: string }>> {
  if (!patientId) return { ok: false, error: 'patientId is required' };
  if (!signedConsent) return { ok: false, error: 'Consent is required to complete the assessment' };
  if (!signatureName || !signatureName.trim()) {
    return { ok: false, error: 'Signature name is required' };
  }

  const validationError = validateBaseFields(form);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Unauthorized' };

  const payload = {
    ...buildPayload(patientId, form),
    draft: false,
    completed_at: new Date().toISOString(),
    signed_consent: true,
    signature_name: signatureName.trim(),
  };

  if (assessmentId) {
    const { data, error } = await supabase
      .from('patient_assessments')
      .update(payload)
      .eq('id', assessmentId)
      .select('id')
      .single();
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/admin/patients/${patientId}`);
    return { ok: true, data: { id: data.id } };
  }

  const { data, error } = await supabase
    .from('patient_assessments')
    .insert(payload)
    .select('id')
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/patients/${patientId}`);
  return { ok: true, data: { id: data.id } };
}
