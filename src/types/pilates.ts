export interface PilatesBatch {
  id: string;
  name: string;
  type: 'online' | 'offline';
  schedule: string;
  days: string;
  time: string;
  capacity: number;
  current_count: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PilatesRegistration {
  id: string;
  batch_id: string | null;
  name: string;
  phone: string;
  email: string;
  age: number | null;
  preference: 'online' | 'offline';
  medical_history: string | null;
  status: 'registered' | 'waitlisted' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'partial';
  consultation_status: 'pending' | 'scheduled' | 'done';
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined field
  batch?: PilatesBatch;
}

export interface PilatesAdminSetting {
  id: string;
  key: string;
  value: string;
}

export interface BodyMapMarker {
  id: string;
  view: 'front' | 'back' | 'side';
  region: string;
  x: number;
  y: number;
  type: 'pain' | 'tightness' | 'weakness' | 'swelling' | 'numbness' | 'other';
  severity: 'mild' | 'moderate' | 'severe';
  note: string;
}

export interface PilatesAssessment {
  id: string;
  student_id: string;
  type: 'initial' | 'progress';
  assessment_date: string;
  session_number?: number;
  assessor_name: string;
  gender?: string;
  occupation?: string;
  referred_by?: string;
  emergency_contact?: string;
  emergency_relation?: string;
  presenting_complaint?: string;
  past_medical_history?: string;
  medications_supplements?: string;
  red_flags?: Record<string, boolean>;
  activity_level?: string;
  exercise_type?: string;
  sitting_hours?: string;
  sleep_quality?: string;
  stress_level?: string;
  smoking?: string;
  pain_location?: string;
  pain_vas?: number;
  pain_duration?: string;
  pain_nature?: string[];
  pain_frequency?: string;
  pain_aggravating?: string;
  pain_easing?: string;
  posture_anterior?: string;
  posture_lateral?: string;
  posture_posterior?: string;
  posture_key_findings?: string[];
  body_map?: { markers: BodyMapMarker[] };
  spinal_rom?: Record<string, Record<string, string>>;
  muscle_tests?: Record<string, string>;
  additional_tests?: string;
  appi_elements?: Record<string, { rating: string; notes: string }>;
  movement_control?: Record<string, string>;
  functional_assessment?: Record<string, string>;
  muscle_slings?: Record<string, string>;
  clinical_impression?: string;
  short_term_goals?: string[];
  long_term_goals?: string[];
  patient_own_goals?: string;
  starting_level?: string;
  mode?: string[];
  assigned_batch_id?: string;
  frequency?: string;
  duration?: string;
  review_weeks?: number;
  batch_days?: string;
  programme_notes?: string;
  info_sheets_provided?: string[];
  consent_given?: boolean;
  client_signature?: string;
  current_level?: string;
  weeks_at_level?: number;
  appi_reassessment?: Record<string, Record<string, string>>;
  exercise_competency?: Record<string, Record<string, string>>;
  outcome_measures?: Record<string, string>;
  client_satisfaction?: string;
  progression_decision?: string;
  next_level?: string;
  repeat_weeks?: number;
  modify_details?: string;
  therapist_notes?: string;
  next_review_date?: string;
  created_at?: string;
  updated_at?: string;
}
