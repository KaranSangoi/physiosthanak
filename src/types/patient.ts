/**
 * Patient & Patient Assessment domain types.
 *
 * Mirrors the convention used in `pilates.ts` — DB columns map 1:1 to
 * snake_case TypeScript properties. JSONB columns are typed as nested
 * objects rather than `Record<string, any>` so the assessment form gets
 * proper IntelliSense.
 *
 * Shared primitives (BodyMapMarker, RedFlags, etc.) are imported from
 * `pilates.ts` to keep both modules consistent.
 */

import type { BodyMapMarker } from './pilates';

// ── Patient ──────────────────────────────────────────────────

export type PatientStatus = 'active' | 'discharged' | 'on_hold';

export interface Patient {
  id: string;

  // Demographics
  name: string;
  age: number | null;
  gender: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  address: string | null;

  // Emergency contact
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;

  // Background
  occupation: string | null;
  occupation_demands: string | null;

  // Clinical intake
  chief_complaint: string | null;
  referring_doctor: string | null;
  treatment_goals: string | null;
  medical_history: string | null;
  current_medications: string | null;
  allergies: string | null;

  // Workflow
  patient_status: PatientStatus;
  notes: string | null;

  created_at: string;
  updated_at: string;
}

// ── Assessment step shapes ───────────────────────────────────

/** Step 1 — Client Details */
export interface PatientClientDetails {
  gender?: string;
  occupation?: string;
  referred_by?: string;
  emergency_contact?: string;
  emergency_relation?: string;
}

/** Step 2 — History */
export interface PatientHistory {
  presenting_complaint?: string;
  past_medical_history?: string;
  medications_supplements?: string;
  allergies?: string;
  red_flags?: Record<string, boolean>;
}

/** Step 3 — Lifestyle */
export interface PatientLifestyle {
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active';
  exercise_type?: string;
  sitting_hours?: string;
  sleep_quality?: string;
  stress_level?: 'low' | 'medium' | 'high';
  smoking?: 'yes' | 'no';
}

/** Step 4 — Pain */
export interface PatientPain {
  pain_location?: string;
  pain_vas?: number; // 0-10
  pain_duration?: string;
  pain_nature?: string[];
  pain_frequency?: 'constant' | 'intermittent';
  pain_aggravating?: string;
  pain_easing?: string;
}

/** Step 5 — Posture */
export interface PatientPosture {
  posture_anterior?: string;
  posture_lateral?: string;
  posture_posterior?: string;
  posture_key_findings?: string[];
  body_map?: { markers: BodyMapMarker[] };
}

// ── Step 6 — ROM (extended per-joint) ────────────────────────

/** A single joint movement measurement. Bilateral movements record both sides. */
export interface JointMovement {
  left?: number; // degrees
  right?: number; // degrees
  /** For unilateral movements (e.g. lumbar flexion) — use this instead of left/right. */
  degrees?: number;
  /** Reference normal range in degrees. */
  normal?: number;
  painful?: boolean;
  notes?: string;
}

export interface CervicalROM {
  flexion?: JointMovement;
  extension?: JointMovement;
  lateral_flexion?: JointMovement;
  rotation?: JointMovement;
}

export interface ShoulderROM {
  flexion?: JointMovement;
  extension?: JointMovement;
  abduction?: JointMovement;
  adduction?: JointMovement;
  internal_rotation?: JointMovement;
  external_rotation?: JointMovement;
}

export interface ElbowROM {
  flexion?: JointMovement;
  extension?: JointMovement;
  supination?: JointMovement;
  pronation?: JointMovement;
}

export interface WristROM {
  flexion?: JointMovement;
  extension?: JointMovement;
  radial_deviation?: JointMovement;
  ulnar_deviation?: JointMovement;
}

export interface HipROM {
  flexion?: JointMovement;
  extension?: JointMovement;
  abduction?: JointMovement;
  adduction?: JointMovement;
  internal_rotation?: JointMovement;
  external_rotation?: JointMovement;
}

export interface KneeROM {
  flexion?: JointMovement;
  extension?: JointMovement;
}

export interface AnkleROM {
  dorsiflexion?: JointMovement;
  plantarflexion?: JointMovement;
  inversion?: JointMovement;
  eversion?: JointMovement;
}

export interface LumbarROM {
  flexion?: JointMovement;
  extension?: JointMovement;
  lateral_flexion?: JointMovement;
  rotation?: JointMovement;
}

export interface PatientROM {
  cervical?: CervicalROM;
  shoulder?: ShoulderROM;
  elbow?: ElbowROM;
  wrist?: WristROM;
  hip?: HipROM;
  knee?: KneeROM;
  ankle?: AnkleROM;
  lumbar?: LumbarROM;
}

// ── Step 7 — Special Tests ───────────────────────────────────

export type TestSide = 'left' | 'right' | 'bilateral';
export type TestResult = 'positive' | 'negative' | 'inconclusive';

export interface OrthopedicTest {
  test_name: string;
  side: TestSide;
  result: TestResult;
  notes?: string;
}

export interface NeurologicalTests {
  reflexes?: Record<string, string>;
  sensation?: Record<string, string>;
  muscle_strength?: Record<string, string>;
}

export interface FunctionalTests {
  balance?: string;
  gait?: string;
  sit_to_stand?: string;
  [key: string]: string | undefined;
}

export interface PatientSpecialTests {
  orthopedic?: OrthopedicTest[];
  neurological?: NeurologicalTests;
  functional?: FunctionalTests;
  notes?: string;
}

// ── Step 8 — Goals ───────────────────────────────────────────

export interface PatientGoals {
  short_term_goals?: string[];
  long_term_goals?: string[];
  patient_own_goals?: string;
}

// ── Step 9 — Treatment Plan ──────────────────────────────────

export interface PrescribedExercise {
  name: string;
  sets?: number;
  reps?: string | number;
  frequency?: string;
  notes?: string;
}

export interface PatientTreatmentPlan {
  modalities?: string[]; // e.g. ['Ultrasound','TENS','Heat','Cold','Manual Therapy']
  manual_therapy?: string[]; // e.g. ['Joint mobilization grade III','MET']
  exercises?: PrescribedExercise[];
  home_program?: string;
  frequency_per_week?: number;
  duration_weeks?: number;
  follow_up_date?: string; // ISO date
  precautions?: string;
  notes?: string;
}

// ── Assessment row ───────────────────────────────────────────

export interface PatientAssessment {
  id: string;
  patient_id: string;

  // Metadata
  assessment_date: string; // ISO date
  assessor: string;
  draft: boolean;
  completed_at: string | null;

  // Steps
  client_details: PatientClientDetails;
  history: PatientHistory;
  lifestyle: PatientLifestyle;
  pain: PatientPain;
  posture: PatientPosture;
  rom: PatientROM;
  special_tests: PatientSpecialTests;
  goals: PatientGoals;
  treatment_plan: PatientTreatmentPlan;

  // Consent
  signed_consent: boolean;
  signature_name: string | null;

  created_at: string;
  updated_at: string;

  // Joined field (optional — populated by client queries)
  patient?: Patient;
}
