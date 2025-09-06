// types/ErrorLog.ts
export interface ErrorLog {
  id?: number;
  title: string;
  description: string;
  status: 'actual' | 'fixed' | 'stopped'; // Added 'stopped'
  solution?: string;
  fixed_at?: string;
  stopped_at?: string; // New field
  resumed_at?: string; // New field
  created_at?: string;
  updated_at?: string;
  downtime_duration?: string; // Optional field for calculated downtime
}

export interface CreateErrorLogData {
  title: string;
  description: string;
  status: 'actual' | 'stopped'; // Added 'stopped' option
  stop_machine?: boolean; // New field to indicate if machine should be stopped
}

export interface UpdateErrorLogData {
  status?: 'fixed' | 'actual' | 'stopped';
  solution?: string;
}