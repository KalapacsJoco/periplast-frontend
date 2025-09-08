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
    status: 'actual'
  });
  const [stopMachine, setStopMachine] = useState(false);
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
        if (stopMachine) {
          await errorLogService.stopMachine(machineId);
          Alert.alert('Siker', 'Hiba rögzítve és gép leállítva');
        } else {
          Alert.alert('Siker', 'Hiba rögzítve');
        }
        
        setNewError({ title: '', description: '', status: 'actual' });
        setStopMachine(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Hiba', 'Nem sikerült teljesen feldolgozni a kérést');
    } finally {
      setIsSubmitting(false);
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
        <Switch
          value={stopMachine}
          onValueChange={setStopMachine}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={stopMachine ? '#f5dd4b' : '#f4f3f4'}
          disabled={isSubmitting}
        />
      </View>
      
      {stopMachine && (
        <Text style={styles.warningText}>
          Figyelem: A gép le lesz állítva a hiba rögzítésekor!
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