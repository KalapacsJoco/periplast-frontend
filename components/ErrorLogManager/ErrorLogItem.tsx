import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { styles } from '../../styles/ErrorLogStyles';
import { ErrorLog } from '../../types/ErrorLog';

interface ErrorLogItemProps {
  item: ErrorLog;
  onMarkAsFixed: (errorLogId: number, solution: string) => Promise<void>;
  onToggleStopStatus: (errorLog: ErrorLog) => Promise<void>;
}

export const ErrorLogItem: React.FC<ErrorLogItemProps> = ({
  item,
  onMarkAsFixed,
  onToggleStopStatus
}) => {
  const [solution, setSolution] = useState('');

  const handleMarkAsFixed = async () => {
    await onMarkAsFixed(item.id!, solution);
    setSolution('');
  };

  const handleToggleStopStatus = async () => {
    await onToggleStopStatus(item);
  };

  return (
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
            onPress={handleMarkAsFixed}
            color="#4CAF50"
          />
          <Button
            title="Gép leállítása"
            onPress={handleToggleStopStatus}
            color="#FF9800"
          />
        </View>
      )}
      
      {item.status === 'stopped' && (
        <View style={styles.actionContainer}>
          <Button
            title="Gép indítása"
            onPress={handleToggleStopStatus}
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
};