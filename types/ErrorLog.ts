// types/ErrorLog.ts
export interface ErrorLog {
  id?: number;
  title: string;
  description: string;
  status: 'actual' | 'fixed';
  solution?: string;
  fixed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateErrorLogData {
  title: string;
  description: string;
  status: 'actual';
}

export interface UpdateErrorLogData {
  status?: 'fixed';
  solution?: string;
}