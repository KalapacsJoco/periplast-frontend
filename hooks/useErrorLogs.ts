import { useState } from 'react';
import { Alert } from 'react-native';
import { errorLogService } from '../services/errorLogService';
import { CreateErrorLogData, ErrorLog } from '../types/ErrorLog';

export const useErrorLogs = (machineId: number) => {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadErrorLogs = async () => {
    try {
      setIsLoading(true);
      const logs = await errorLogService.getMachineErrorLogs(machineId);
      setErrorLogs(logs);
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült betölteni a hibanaplókat');
    } finally {
      setIsLoading(false);
    }
  };

  const createErrorLog = async (data: CreateErrorLogData) => {
    try {
      await errorLogService.createMachineErrorLog(machineId, data);
      
      if (data.stop_machine && data.status === 'stopped') {
        await errorLogService.stopMachine(machineId);
      } else {
        await errorLogService.warnMachine(machineId);
      }
      
      return true;
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült létrehozni a hibanapló bejegyzést');
      return false;
    }
  };

  const markAsFixed = async (errorLogId: number, solution: string) => {
    try {
      await errorLogService.updateErrorLog(errorLogId, {
        status: 'fixed',
        solution: solution.trim() || 'Megoldva'
      });
      
      await errorLogService.workingMachine(machineId);
      return true;
    } catch (error) {
      console.error('Error marking as fixed:', error);
      Alert.alert('Hiba', 'Nem sikerült frissíteni a hibanapló bejegyzést');
      return false;
    }
  };

  const toggleStopStatus = async (errorLog: ErrorLog) => {
    try {
      const newStatus = errorLog.status === 'stopped' ? 'actual' : 'stopped';
      await errorLogService.updateErrorLog(errorLog.id!, {
        status: newStatus
      });
      
      if (newStatus === 'stopped') {
        await errorLogService.stopMachine(machineId);
      } else {
        await errorLogService.workingMachine(machineId);
      }
      
      return newStatus;
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült frissíteni a gép állapotát');
      return null;
    }
  };

  return {
    errorLogs,
    isLoading,
    loadErrorLogs,
    createErrorLog,
    markAsFixed,
    toggleStopStatus
  };
};