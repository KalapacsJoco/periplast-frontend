import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { styles } from '../styles/MachineListStyles';

type Machine = {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  active_error?: string;
};

const statusConfig = {
  working: { color: '#10B981', icon: 'play-circle', label: 'Működik' },
  warning: { color: '#F59E0B', icon: 'warning', label: 'Figyelmeztetés' },
  available: { color: '#3B82F6', icon: 'checkmark-circle', label: 'Elérhető' },
  under_setup: { color: '#8B5CF6', icon: 'construct', label: 'Beállítás alatt' },
  stopped: { color: '#EF4444', icon: 'stop-circle', label: 'Leállítva' }
};

export default function Machines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const machinesResponse = await axios.get("http://192.168.0.104:8000/api/machines");
      const machinesData = machinesResponse.data;

      // Fetch latest active error for each machine
      const machinesWithErrors = await Promise.all(
        machinesData.map(async (machine: Machine) => {
          try {
            const errorsResponse = await axios.get(`http://192.168.0.104:8000/api/machines/${machine.id}/error-logs`);
            const errorLogs = errorsResponse.data;
            
            const activeError = errorLogs
              .filter((error: any) => error.status === 'actual')
              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

            return {
              ...machine,
              active_error: activeError ? activeError.title : undefined
            };
          } catch (error) {
            console.error(`Error fetching errors for machine ${machine.id}:`, error);
            return machine;
          }
        })
      );

      setMachines(machinesWithErrors);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Gépek betöltése...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text style={styles.errorTitle}>Hiba történt</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadMachines}
        >
          <Text style={styles.retryText}>Újrapróbálkozás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gépek</Text>
        <Text style={styles.subtitle}>{machines.length} gép található</Text>
      </View>
      
      <FlatList
        data={machines}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const status = getStatusConfig(item.status);
          const hasError = !!item.active_error;
          
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/machine/${item.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.machineInfo}>
                  <Ionicons 
                    name="hardware-chip" 
                    size={24} 
                    color={hasError ? status.color : '#6B7280'} 
                  />
                  <Text style={styles.machineName}>
                    {item.name}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
                  <Ionicons 
                    name={status.icon as any} 
                    size={16} 
                    color={status.color} 
                  />
                  <Text style={[styles.statusText, { color: status.color }]}>
                    {status.label}
                  </Text>
                </View>
              </View>
              
              {/* Error Display with matching status color */}
              {hasError && (
                <View style={[
                  styles.errorBox, 
                  { 
                    borderLeftColor: status.color,
                    backgroundColor: `${status.color}15`
                  }
                ]}>
                  <Ionicons name="warning" size={16} color={status.color} />
                  <Text style={[styles.errorText, { color: status.color }]} numberOfLines={2}>
                    {item.active_error}
                  </Text>
                </View>
              )}
              
              <View style={styles.cardFooter}>
                <Text style={styles.dateText}>
                  Frissítve: {formatDate(item.updated_at)}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </View>
              
              <View style={[styles.statusIndicator, { backgroundColor: status.color }]} />
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}