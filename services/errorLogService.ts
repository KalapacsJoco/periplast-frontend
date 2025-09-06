// services/errorLogService.ts
import { API_BASE_URL } from "../config/api";
import { CreateErrorLogData, ErrorLog, UpdateErrorLogData } from '../types/ErrorLog';



export const errorLogService = {
  // Get error logs for a machine
  getMachineErrorLogs: async (machineId: number): Promise<ErrorLog[]> => {
    const response = await fetch(`${API_BASE_URL}/machines/${machineId}/error-logs`);
    return response.json();
  },

  // Create a new error log for a machine
  createMachineErrorLog: async (machineId: number, data: CreateErrorLogData): Promise<ErrorLog> => {
    const response = await fetch(`${API_BASE_URL}/machines/${machineId}/error-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Update an error log (mark as fixed)
  updateErrorLog: async (errorLogId: number, data: UpdateErrorLogData): Promise<ErrorLog> => {
    const response = await fetch(`${API_BASE_URL}/error-logs/${errorLogId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete an error log
  deleteErrorLog: async (errorLogId: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/error-logs/${errorLogId}`, {
      method: 'DELETE',
    });
  },
};