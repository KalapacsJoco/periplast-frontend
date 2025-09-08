// Update your MachineHeader component
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { styles } from "../styles/MachineDetailsStyles";
import ErrorLogManager from './ErrorLogManager/ErrorLogManager';

interface MachineHeaderProps {
  machine: any;
}

const MachineHeader: React.FC<MachineHeaderProps> = ({ machine }) => {
  const [showErrorLog, setShowErrorLog] = useState(false);

  return (
    <>
      <View style={styles.machineHeader}>
        <Text style={styles.title}>{machine.name}</Text>
        <Text>ID: {machine.id}</Text>
        <Text>Állapot: {machine.status}</Text>
        <Text>Létrehozva: {new Date(machine.created_at).toLocaleDateString('hu-HU')}</Text>
        <Text>Módosítva: {new Date(machine.updated_at).toLocaleDateString('hu-HU')}</Text>
        
        <Button
          title="Hibanapló megnyitása"
          onPress={() => setShowErrorLog(true)}
        />
      </View>

      <ErrorLogManager
        machineId={machine.id}
        visible={showErrorLog}
        onClose={() => setShowErrorLog(false)}
      />
    </>
  );
};

export default MachineHeader;