import { CreateErrorLogData, ErrorLog } from '@/types/ErrorLog';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Modal, Text, View } from 'react-native';
import { useErrorLogs } from '../../hooks/useErrorLogs';
import { styles } from '../../styles/ErrorLogStyles';
import { ErrorLogForm } from './ErrorLogForm';
import { ErrorLogList } from './ErrorLogList';

interface ErrorLogManagerProps {
  machineId: number;
  visible: boolean;
  onClose: () => void;
}

export const ErrorLogManager: React.FC<ErrorLogManagerProps> = ({
  machineId,
  visible,
  onClose
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const { errorLogs, isLoading, loadErrorLogs, createErrorLog, markAsFixed, toggleStopStatus } = useErrorLogs(machineId);

  useEffect(() => {
    if (visible) {
      loadErrorLogs();
    }
  }, [visible]);

  const handleCreateErrorLog = async (data: CreateErrorLogData) => {
    const success = await createErrorLog(data);
    if (success) {
      setIsCreating(false);
      loadErrorLogs();
      Alert.alert('Siker', 'Hiba sikeresen rögzítve');
    }
    return success;
  };

  const handleMarkAsFixed = async (errorLogId: number, solution: string) => {
    const success = await markAsFixed(errorLogId, solution);
    if (success) {
      loadErrorLogs();
      Alert.alert('Siker', 'Hiba javítva és gép elindítva');
    }
  };

  const handleToggleStopStatus = async (errorLog: ErrorLog) => {
    const newStatus = await toggleStopStatus(errorLog);
    if (newStatus) {
      loadErrorLogs();
      Alert.alert('Siker', `Gép ${newStatus === 'stopped' ? 'leállítva' : 'újraindítva'}`);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hibanapló</Text>
          <Button title="Bezárás" onPress={onClose} />
        </View>

        {!isCreating ? (
          <>
            <Button
              title="Új hiba rögzítése"
              onPress={() => setIsCreating(true)}
            />
            
            <ErrorLogList
              errorLogs={errorLogs}
              onMarkAsFixed={handleMarkAsFixed}
              onToggleStopStatus={handleToggleStopStatus}
            />
          </>
        ) : (
          <ErrorLogForm
            machineId={machineId}
            onSubmit={handleCreateErrorLog}
            onCancel={() => setIsCreating(false)}
          />
        )}
      </View>
    </Modal>
  );
};

export default ErrorLogManager;