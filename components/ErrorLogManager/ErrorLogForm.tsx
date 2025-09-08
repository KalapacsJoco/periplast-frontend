import { errorLogService } from '@/services/errorLogService';
import React, { useState } from 'react';
import { Alert, Button, Switch, Text, TextInput, View } from 'react-native';
import { styles } from '../../styles/ErrorLogStyles';
import { CreateErrorLogData } from '../../types/ErrorLog';

interface ErrorLogFormProps {
  machineId: number;
  onSubmit: (data: CreateErrorLogData) => Promise<boolean>;
  onCancel: () => void;
}

export const ErrorLogForm: React.FC<ErrorLogFormProps> = ({
  machineId,
  onSubmit,
  onCancel
}) => {
  const [newError, setNewError] = useState<CreateErrorLogData>({
    title: '',
    description: '',
    status: 'actual',
    stop_machine: false
  });
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newError.title.trim() || !newError.description.trim()) {
      Alert.alert('Hiba', 'A cím és leírás megadása kötelező');
      return;
    }

    const success = await onSubmit(newError);
    if (success) {
      setNewError({ title: '', description: '', status: 'actual', stop_machine: false });
    }
  };

  const handleMachineSwitch = async (value: boolean) => {
    setIsSwitchLoading(true);
    try {
      setNewError({ 
        ...newError, 
        stop_machine: value,
        status: value ? 'stopped' : 'actual'
      });
      
      if (value) {
        await errorLogService.stopMachine(machineId);
        Alert.alert('Siker', 'Gép leállítva');
      } else {
        await errorLogService.warnMachine(machineId);
        Alert.alert('Siker', 'Gép figyelmeztetés állapotba helyezve');
      }
    } catch (error) {
      console.error('Error controlling machine:', error);
      Alert.alert('Hiba', 'Nem sikerült frissíteni a gép állapotát');
      setNewError({ 
        ...newError, 
        stop_machine: !value,
        status: !value ? 'stopped' : 'actual'
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  return (
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
        {isSwitchLoading ? (
          <Text>Betöltés...</Text>
        ) : (
          <Switch
            value={newError.stop_machine}
            onValueChange={handleMachineSwitch}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={newError.stop_machine ? '#f5dd4b' : '#f4f3f4'}
          />
        )}
      </View>
      
      {newError.stop_machine && (
        <Text style={styles.warningText}>
          Figyelem: A gép le lesz állítva a hiba rögzítésekor!
        </Text>
      )}
      
      {!newError.stop_machine && (
        <Text style={styles.warningText}>
          Figyelem: A gép figyelmeztetés állapotba kerül!
        </Text>
      )}
      
      <View style={styles.formButtons}>
        <Button
          title="Mentés"
          onPress={handleSubmit}
        />
        <Button
          title="Mégse"
          onPress={onCancel}
          color="#999"
        />
      </View>
    </View>
  );
};