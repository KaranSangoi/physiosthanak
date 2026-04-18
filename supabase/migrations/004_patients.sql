-- ═══════════════════════════════════════════════════════════
-- PhysioSthanak — Patients & Patient Assessments
-- Migration 004: Clinical patient management (separate from Pilates)
-- Run via Supabase Dashboard → SQL Editor, or `supabase db push`.
-- Does NOT modify pilates_registrations or pilates_assessments.
-- ═══════════════════════════════════════════════════════════

-- 1. Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Demographics
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  address TEXT,

  -- Emergency contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,

  -- Background
  occupation TEXT,
  occupation_demands TEXT,

  -- Clinical intake
  chief_complaint TEXT,
  referring_doctor TEXT,
  treatment_goals TEXT,
  medical_history TEXT,
  current_medications TEXT,
  allergies TEXT,

  -- Workflow
  patient_status TEXT NOT NULL DEFAULT 'active'
    CHECK (patient_status IN ('active', 'discharged', 'on_hold')),
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(patient_status);

-- RLS — match existing admin pattern (authenticated users have full CRUD)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage patients"
  ON patients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Patient Assessments table
CREATE TABLE IF NOT EXISTS patient_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

  -- Assessment metadata
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  assessor TEXT NOT NULL,
  draft BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ,

  -- Step 1 — Client Details (mirrors pilates client section)
  client_details JSONB DEFAULT '{}',

  -- Step 2 — History (HOPC + medical history + medications + red flags)
  history JSONB DEFAULT '{}',

  -- Step 3 — Lifestyle (activity, exercise, sitting hours, sleep, stress, smoking)
  lifestyle JSONB DEFAULT '{}',

  -- Step 4 — Pain (location, VAS, duration, nature, frequency, aggravating, easing)
  pain JSONB DEFAULT '{}',

  -- Step 5 — Posture (anterior/lateral/posterior + key findings + body map)
  posture JSONB DEFAULT '{}',

  -- Step 6 — ROM (per-joint with degrees, painful flag, notes)
  -- Shape:
  -- {
  --   cervical: { flexion: { left, right, normal, painful, notes }, extension, lateral_flexion, rotation },
  --   shoulder: { flexion, extension, abduction, adduction, internal_rotation, external_rotation },
  --   elbow:    { flexion, extension, supination, pronation },
  --   wrist:    { flexion, extension, radial_deviation, ulnar_deviation },
  --   hip:      { flexion, extension, abduction, adduction, internal_rotation, external_rotation },
  --   knee:     { flexion, extension },
  --   ankle:    { dorsiflexion, plantarflexion, inversion, eversion },
  --   lumbar:   { flexion, extension, lateral_flexion, rotation }
  -- }
  rom JSONB DEFAULT '{}',

  -- Step 7 — Special Tests (orthopedic, neurological, functional)
  -- Shape:
  -- {
  --   orthopedic: [{ test_name, side: 'left'|'right'|'bilateral', result: 'positive'|'negative'|'inconclusive', notes }],
  --   neurological: { reflexes: {...}, sensation: {...}, muscle_strength: {...} },
  --   functional: { balance, gait, sit_to_stand, ... },
  --   notes: string
  -- }
  special_tests JSONB DEFAULT '{}',

  -- Step 8 — Goals (short-term, long-term, patient's own)
  goals JSONB DEFAULT '{}',

  -- Step 9 — Treatment Plan
  -- Shape:
  -- {
  --   modalities: string[],
  --   manual_therapy: string[],
  --   exercises: [{ name, sets, reps, frequency, notes }],
  --   home_program: string,
  --   frequency_per_week: number,
  --   duration_weeks: number,
  --   follow_up_date: date,
  --   precautions: string,
  --   notes: string
  -- }
  treatment_plan JSONB DEFAULT '{}',

  -- Consent
  signed_consent BOOLEAN NOT NULL DEFAULT false,
  signature_name TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patient_assessments_patient ON patient_assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_assessments_date ON patient_assessments(assessment_date DESC);

-- RLS
ALTER TABLE patient_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage patient assessments"
  ON patient_assessments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- updated_at triggers (shared helper)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS patients_set_updated_at ON patients;
CREATE TRIGGER patients_set_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS patient_assessments_set_updated_at ON patient_assessments;
CREATE TRIGGER patient_assessments_set_updated_at
  BEFORE UPDATE ON patient_assessments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
