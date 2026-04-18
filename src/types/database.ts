/**
 * Supabase-style generated types for the patients module.
 *
 * NOTE: This file is hand-maintained to match what
 * `supabase gen types typescript` would produce for the `patients` and
 * `patient_assessments` tables in migration 004. Re-generate via the Supabase
 * CLI or MCP tooling when the schema changes:
 *
 *   npx supabase gen types typescript --project-id <id> --schema public > src/types/database.ts
 *
 * The existing pilates tables (pilates_registrations, pilates_assessments)
 * are intentionally NOT included here — their TS shapes live in
 * src/types/pilates.ts and are unaffected by this migration.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PatientStatus = 'active' | 'discharged' | 'on_hold';

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          name: string;
          age: number | null;
          gender: string | null;
          contact_phone: string | null;
          contact_email: string | null;
          address: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          occupation: string | null;
          occupation_demands: string | null;
          chief_complaint: string | null;
          referring_doctor: string | null;
          treatment_goals: string | null;
          medical_history: string | null;
          current_medications: string | null;
          allergies: string | null;
          patient_status: PatientStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          age?: number | null;
          gender?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          occupation?: string | null;
          occupation_demands?: string | null;
          chief_complaint?: string | null;
          referring_doctor?: string | null;
          treatment_goals?: string | null;
          medical_history?: string | null;
          current_medications?: string | null;
          allergies?: string | null;
          patient_status?: PatientStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          age?: number | null;
          gender?: string | null;
          contact_phone?: string | null;
          contact_email?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          occupation?: string | null;
          occupation_demands?: string | null;
          chief_complaint?: string | null;
          referring_doctor?: string | null;
          treatment_goals?: string | null;
          medical_history?: string | null;
          current_medications?: string | null;
          allergies?: string | null;
          patient_status?: PatientStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      patient_assessments: {
        Row: {
          id: string;
          patient_id: string;
          assessment_date: string;
          assessor: string;
          draft: boolean;
          completed_at: string | null;
          client_details: Json;
          history: Json;
          lifestyle: Json;
          pain: Json;
          posture: Json;
          rom: Json;
          special_tests: Json;
          goals: Json;
          treatment_plan: Json;
          signed_consent: boolean;
          signature_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          assessment_date?: string;
          assessor: string;
          draft?: boolean;
          completed_at?: string | null;
          client_details?: Json;
          history?: Json;
          lifestyle?: Json;
          pain?: Json;
          posture?: Json;
          rom?: Json;
          special_tests?: Json;
          goals?: Json;
          treatment_plan?: Json;
          signed_consent?: boolean;
          signature_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          assessment_date?: string;
          assessor?: string;
          draft?: boolean;
          completed_at?: string | null;
          client_details?: Json;
          history?: Json;
          lifestyle?: Json;
          pain?: Json;
          posture?: Json;
          rom?: Json;
          special_tests?: Json;
          goals?: Json;
          treatment_plan?: Json;
          signed_consent?: boolean;
          signature_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'patient_assessments_patient_id_fkey';
            columns: ['patient_id'];
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
