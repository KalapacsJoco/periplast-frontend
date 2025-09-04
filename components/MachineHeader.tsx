import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/MachineDetailsStyles";

interface MachineHeaderProps {
  machine: any;
}

const MachineHeader: React.FC<MachineHeaderProps> = ({ machine }) => {
  return (
    <View style={styles.machineHeader}>
      <Text style={styles.title}>{machine.name}</Text>
      <Text>ID: {machine.id}</Text>
      <Text>Állapot: {machine.status}</Text>
      <Text>Létrehozva: {new Date(machine.created_at).toLocaleDateString('hu-HU')}</Text>
      <Text>Módosítva: {new Date(machine.updated_at).toLocaleDateString('hu-HU')}</Text>
    </View>
  );
};

export default MachineHeader;