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
