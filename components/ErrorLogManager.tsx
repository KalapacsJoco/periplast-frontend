// components/ErrorLogManager.tsx
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Modal, Switch, Text, TextInput, View } from 'react-native';
import { errorLogService } from '../services/errorLogService';
import { styles } from '../styles/ErrorLogStyles';
import { CreateErrorLogData, ErrorLog } from '../types/ErrorLog';

interface ErrorLogManagerProps {
  machineId: number;
  visible: boolean;
  onClose: () => void;
}

const ErrorLogManager: React.FC<ErrorLogManagerProps> = ({ machineId, visible, onClose }) => {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newError, setNewError] = useState<CreateErrorLogData>({
    title: '',
    description: '',
    status: 'actual',
    stop_machine: false
  });
  const [solution, setSolution] = useState('');

  useEffect(() => {
    if (visible) {
      loadErrorLogs();
    }
  }, [visible]);

  const loadErrorLogs = async () => {
    try {
      const logs = await errorLogService.getMachineErrorLogs(machineId);
      setErrorLogs(logs);
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült betölteni a hibanaplókat');
    }
  };

  const createErrorLog = async () => {
    if (!newError.title.trim() || !newError.description.trim()) {
      Alert.alert('Hiba', 'A cím és leírás megadása kötelező');
      return;
    }

    try {
      await errorLogService.createMachineErrorLog(machineId, newError);
      
      // If stop machine is selected, call the stop endpoint
      if (newError.stop_machine && newError.status === 'stopped') {
        await errorLogService.stopMachine(machineId);
      }
      
      setNewError({ title: '', description: '', status: 'actual', stop_machine: false });
      setIsCreating(false);
      loadErrorLogs();
      Alert.alert('Siker', 'Hiba sikeresen rögzítve');
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült létrehozni a hibanapló bejegyzést');
    }
  };

  const markAsFixed = async (errorLog: ErrorLog) => {
    try {
      await errorLogService.updateErrorLog(errorLog.id!, {
        status: 'fixed',
        solution: solution.trim() || 'Megoldva'
      });
      setSolution('');
      loadErrorLogs();
      Alert.alert('Siker', 'Hiba státusza frissítve');
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült frissíteni a hibanapló bejegyzést');
    }
  };

  const toggleStopStatus = async (errorLog: ErrorLog) => {
    try {
      const newStatus = errorLog.status === 'stopped' ? 'actual' : 'stopped';
      await errorLogService.updateErrorLog(errorLog.id!, {
        status: newStatus
      });
      
      // Also stop/resume the machine
      if (newStatus === 'stopped') {
        await errorLogService.stopMachine(machineId);
      } else {
        await errorLogService.resumeMachine(machineId);
      }
      
      loadErrorLogs();
      Alert.alert('Siker', `Gép ${newStatus === 'stopped' ? 'leállítva' : 'újraindítva'}`);
    } catch (error) {
      Alert.alert('Hiba', 'Nem sikerült frissíteni a gép állapotát');
    }
  };

  const renderErrorLogItem = ({ item }: { item: ErrorLog }) => (
    <View style={styles.errorLogItem}>
      <Text style={styles.errorLogTitle}>{item.title}</Text>
      <Text style={styles.errorLogDescription}>{item.description}</Text>
      
      <View style={styles.statusRow}>
        <Text style={[
          styles.statusBadge,
          item.status === 'fixed' ? styles.statusFixed : 
          item.status === 'stopped' ? styles.statusStopped : 
          styles.statusActual
        ]}>
          {item.status === 'fixed' ? 'Javítva' : 
           item.status === 'stopped' ? 'Leállítva' : 
           'Aktuális'}
        </Text>
        
        {item.status === 'stopped' && item.downtime_duration && (
          <Text style={styles.downtimeText}>
            Állásidő: {item.downtime_duration}
          </Text>
        )}
      </View>
      
      {item.status === 'fixed' && item.solution && (
        <Text style={styles.solutionText}>Megoldás: {item.solution}</Text>
      )}
      
      {item.status === 'actual' && (
        <View style={styles.actionContainer}>
          <TextInput
            style={styles.solutionInput}
            placeholder="Megoldás leírása..."
            value={solution}
            onChangeText={setSolution}
          />
          <Button
            title="Javítva"
            onPress={() => markAsFixed(item)}
            color="#4CAF50"
          />
          <Button
            title="Gép leállítása"
            onPress={() => toggleStopStatus(item)}
            color="#FF9800"
          />
        </View>
      )}
      
      {item.status === 'stopped' && (
        <View style={styles.actionContainer}>
          <Button
            title="Gép indítása"
            onPress={() => toggleStopStatus(item)}
            color="#2196F3"
          />
        </View>
      )}
      
      <Text style={styles.dateText}>
        Létrehozva: {new Date(item.created_at!).toLocaleDateString('hu-HU')}
        {item.fixed_at && ` - Javítva: ${new Date(item.fixed_at).toLocaleDateString('hu-HU')}`}
        {item.stopped_at && ` - Leállítva: ${new Date(item.stopped_at).toLocaleDateString('hu-HU')}`}
        {item.resumed_at && ` - Indítva: ${new Date(item.resumed_at).toLocaleDateString('hu-HU')}`}
      </Text>
    </View>
  );

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
            
            <FlatList
              data={errorLogs}
              renderItem={renderErrorLogItem}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              style={styles.list}
            />
          </>
        ) : (
          <View style={styles.createForm}>
            <TextInput
              style={styles.input}
              placeholder="Hiba címe"
              value={newError.title}
              onChangeText={(text) => setNewError({ ...newError, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Hiba leírása"
              value={newError.description}
              onChangeText={(text) => setNewError({ ...newError, description: text })}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.switchContainer}>
              <Text>Gép leállítása a hiba miatt:</Text>
              <Switch
                value={newError.stop_machine}
                onValueChange={(value) => setNewError({ 
                  ...newError, 
                  stop_machine: value,
                  status: value ? 'stopped' : 'actual'
                })}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={newError.stop_machine ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
            
            {newError.stop_machine && (
              <Text style={styles.warningText}>
                Figyelem: A gép le lesz állítva a hiba rögzítésekor!
              </Text>
            )}
            
            <View style={styles.formButtons}>
              <Button
                title="Mentés"
                onPress={createErrorLog}
              />
              <Button
                title="Mégse"
                onPress={() => setIsCreating(false)}
                color="#999"
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default ErrorLogManager;