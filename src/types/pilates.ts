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
}
