import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

export default function MachineDetails() {
  const { id } = useLocalSearchParams();
  const [machine, setMachine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`http://192.168.0.104:8000/api/machines/${id}`)
      .then((res) => {
        setMachine(res.data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderNumber}>{item.customer_order_number}</Text>
      <Text style={styles.productName}>{item.product_name}</Text>
      
      <View style={styles.orderDetails}>
        <Text>Anyag: {item.material}</Text>
        <Text>Bruttó súly: {item.gross_weight_has_to_be} g</Text>
        <Text>Nettó súly: {item.net_weight_has_to_be} g</Text>
        <Text>Ciklusidő: {item.cycle_time_has_to_be} mp</Text>
        <Text>Mennyiség: {item.quantity} db</Text>
        <Text>Meleg vizes hűtés: {item.hot_water_cooling ? 'Igen' : 'Nem'}</Text>
      </View>
      
      <Text style={styles.orderDate}>
        Létrehozva: {new Date(item.created_at).toLocaleDateString('hu-HU')}
      </Text>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  if (error) return <Text>Hiba: {error}</Text>;
  if (!machine) return <Text>Nincs adat</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.machineHeader}>
        <Text style={styles.title}>{machine.name}</Text>
        <Text>ID: {machine.id}</Text>
        <Text>Állapot: {machine.status}</Text>
        <Text>Létrehozva: {new Date(machine.created_at).toLocaleDateString('hu-HU')}</Text>
        <Text>Módosítva: {new Date(machine.updated_at).toLocaleDateString('hu-HU')}</Text>
      </View>

      <View style={styles.ordersSection}>
        <Text style={styles.sectionTitle}>
          Futó megrendelések ({machine.running_orders?.length || 0})
        </Text>
        
        {machine.running_orders && machine.running_orders.length > 0 ? (
          <FlatList
            data={machine.running_orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // Since we're inside ScrollView
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <Text style={styles.noOrders}>Nincsenek futó megrendelések</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  machineHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  ordersSection: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  
  orderCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  
  orderDetails: {
    marginBottom: 10,
  },
  
  orderDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  
  separator: {
    height: 10,
  },
  
  noOrders: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: '#333',
  },
});