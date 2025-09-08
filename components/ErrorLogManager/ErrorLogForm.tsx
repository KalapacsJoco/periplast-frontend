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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newError.title.trim() || !newError.description.trim()) {
      Alert.alert('Hiba', 'A cím és leírás megadása kötelező');
      return;
    }

    setIsSubmitting(true);
    try {
      // First submit the error log
      const success = await onSubmit(newError);
      
      if (success) {
        // If switch is on, stop the machine after successful submission
        if (newError.stop_machine) {
          await errorLogService.stopMachine(machineId);
          Alert.alert('Siker', 'Hiba rögzítve és gép leállítva');
        } else {
          // If switch is off, set machine to warning
          await errorLogService.warnMachine(machineId);
          Alert.alert('Siker', 'Hiba rögzítve és gép figyelmeztetés állapotba helyezve');
        }
        
        setNewError({ title: '', description: '', status: 'actual', stop_machine: false });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Hiba', 'Nem sikerült teljesen feldolgozni a kérést');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMachineSwitch = (value: boolean) => {
    setNewError({ 
      ...newError, 
      stop_machine: value,
      status: value ? 'stopped' : 'actual'
    });
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
        <Switch
          value={newError.stop_machine}
          onValueChange={handleMachineSwitch}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={newError.stop_machine ? '#f5dd4b' : '#f4f3f4'}
          disabled={isSubmitting}
        />
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
          title={isSubmitting ? "Feldolgozás..." : "Mentés"}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
        <Button
          title="Mégse"
          onPress={onCancel}
          color="#999"
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
};