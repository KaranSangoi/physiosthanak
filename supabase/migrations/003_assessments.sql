-- Pilates Clinical Assessment System
-- Supports both Initial and Progress assessments

CREATE TABLE IF NOT EXISTS pilates_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES pilates_registrations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('initial', 'progress')),
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  session_number INTEGER,
  assessor_name TEXT NOT NULL,

  -- Client details
  gender TEXT,
  occupation TEXT,
  referred_by TEXT,
  emergency_contact TEXT,
  emergency_relation TEXT,

  -- HOPC
  presenting_complaint TEXT,

  -- Medical History
  past_medical_history TEXT,
  medications_supplements TEXT,

  -- Red Flags
  red_flags JSONB DEFAULT '{}',

  -- Activity Level & Lifestyle
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active')),
  exercise_type TEXT,
  sitting_hours TEXT,
  sleep_quality TEXT,
  stress_level TEXT CHECK (stress_level IN ('low', 'medium', 'high')),
  smoking TEXT CHECK (smoking IN ('yes', 'no')),

  -- Pain Assessment
  pain_location TEXT,
  pain_vas INTEGER CHECK (pain_vas >= 0 AND pain_vas <= 10),
  pain_duration TEXT,
  pain_nature JSONB DEFAULT '[]',
  pain_frequency TEXT CHECK (pain_frequency IN ('constant', 'intermittent')),
  pain_aggravating TEXT,
  pain_easing TEXT,

  -- Posture Assessment
  posture_anterior TEXT,
  posture_lateral TEXT,
  posture_posterior TEXT,
  posture_key_findings JSONB DEFAULT '[]',

  -- Body Map
  body_map JSONB DEFAULT '{"markers": []}',

  -- Spinal ROM
  spinal_rom JSONB DEFAULT '{}',

  -- Muscle Length & Functional Tests
  muscle_tests JSONB DEFAULT '{}',

  -- Additional Tests
  additional_tests TEXT,

  -- APPI 5 Key Elements
  appi_elements JSONB DEFAULT '{}',

  -- Movement Control
  movement_control JSONB DEFAULT '{}',

  -- Functional Assessment
  functional_assessment JSONB DEFAULT '{}',

  -- Muscle Sling Assessment
  muscle_slings JSONB DEFAULT '{}',

  -- Clinical Impression
  clinical_impression TEXT,

  -- Goals
  short_term_goals TEXT[],
  long_term_goals TEXT[],
  patient_own_goals TEXT,

  -- Recommended Programme
  starting_level TEXT CHECK (starting_level IN ('rehab', 'beginner', 'intermediate', 'advanced')),
  mode JSONB DEFAULT '[]',
  assigned_batch_id UUID REFERENCES pilates_batches(id),
  frequency TEXT,
  duration TEXT DEFAULT '45 min',
  review_weeks INTEGER,
  batch_days TEXT,

  -- Programme Notes
  programme_notes TEXT,

  -- Info Sheets
  info_sheets_provided JSONB DEFAULT '[]',

  -- Consent
  consent_given BOOLEAN DEFAULT false,
  client_signature TEXT,

  -- Progress specific
  current_level TEXT CHECK (current_level IN ('rehab', 'beginner', 'intermediate', 'advanced')),
  weeks_at_level INTEGER,
  appi_reassessment JSONB DEFAULT '{}',
  exercise_competency JSONB DEFAULT '{}',
  outcome_measures JSONB DEFAULT '{}',
  client_satisfaction TEXT CHECK (client_satisfaction IN ('very_happy', 'happy', 'neutral', 'needs_improvement')),
  progression_decision TEXT CHECK (progression_decision IN ('progress', 'repeat', 'modify')),
  next_level TEXT,
  repeat_weeks INTEGER,
  modify_details TEXT,
  therapist_notes TEXT,
  next_review_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_student ON pilates_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON pilates_assessments(type);

ALTER TABLE pilates_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can manage assessments" ON pilates_assessments FOR ALL TO authenticated USING (true) WITH CHECK (true);
