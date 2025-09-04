import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function MachineDetails() {
  const { id } = useLocalSearchParams();
  const [machine, setMachine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    gross_weight: "",
    net_weight: "",
    cycle_time: ""
  });

  useEffect(() => {
    fetchMachineData();
  }, [id]);

  const fetchMachineData = () => {
    setLoading(true);
    axios
      .get(`http://192.168.0.104:8000/api/machines/${id}`)
      .then((res) => {
        setMachine(res.data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleEdit = (order: any) => {
    setEditingOrderId(order.id);
    setFormData({
      gross_weight: order.gross_weight?.toString() || "",
      net_weight: order.net_weight?.toString() || "",
      cycle_time: order.cycle_time?.toString() || ""
    });
  };

  const handleSave = async (orderId: number) => {
    try {
      const payload = {
        gross_weight: formData.gross_weight ? parseFloat(formData.gross_weight) : null,
        net_weight: formData.net_weight ? parseFloat(formData.net_weight) : null,
        cycle_time: formData.cycle_time ? parseFloat(formData.cycle_time) : null,
      };

      await axios.put(`http://192.168.0.104:8000/api/orders/${orderId}`, payload);
      
      Alert.alert("Siker", "Adatok frissítve!");
      setEditingOrderId(null);
      fetchMachineData(); // Refresh data
    } catch (error) {
      Alert.alert("Hiba", "Sikertelen frissítés");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingOrderId(null);
    setFormData({ gross_weight: "", net_weight: "", cycle_time: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderNumber}>{item.customer_order_number}</Text>
      <Text style={styles.productName}>{item.product_name}</Text>
      
      <View style={styles.orderDetails}>
        <Text>Anyag: {item.material}</Text>
        <Text>Bruttó súly (cél): {item.gross_weight_has_to_be} g</Text>
        <Text>Nettó súly (cél): {item.net_weight_has_to_be} g</Text>
        <Text>Ciklusidő (cél): {item.cycle_time_has_to_be} mp</Text>
        <Text>Mennyiség: {item.quantity} db</Text>
        <Text>Meleg vizes hűtés: {item.hot_water_cooling ? 'Igen' : 'Nem'}</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Tényleges értékek:</Text>
        
        <View style={styles.inputRow}>
          <Text style={styles.inputText}>Bruttó súly:</Text>
          {editingOrderId === item.id ? (
            <TextInput
              style={styles.input}
              value={formData.gross_weight}
              onChangeText={(value) => handleInputChange('gross_weight', value)}
              keyboardType="numeric"
              placeholder="0.00"
            />
          ) : (
            <Text style={styles.valueText}>
              {item.gross_weight ? `${item.gross_weight} g` : 'Nincs megadva'}
            </Text>
          )}
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputText}>Nettó súly:</Text>
          {editingOrderId === item.id ? (
            <TextInput
              style={styles.input}
              value={formData.net_weight}
              onChangeText={(value) => handleInputChange('net_weight', value)}
              keyboardType="numeric"
              placeholder="0.00"
            />
          ) : (
            <Text style={styles.valueText}>
              {item.net_weight ? `${item.net_weight} g` : 'Nincs megadva'}
            </Text>
          )}
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.inputText}>Ciklusidő:</Text>
          {editingOrderId === item.id ? (
            <TextInput
              style={styles.input}
              value={formData.cycle_time}
              onChangeText={(value) => handleInputChange('cycle_time', value)}
              keyboardType="numeric"
              placeholder="0.00"
            />
          ) : (
            <Text style={styles.valueText}>
              {item.cycle_time ? `${item.cycle_time} mp` : 'Nincs megadva'}
            </Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {editingOrderId === item.id ? (
          <>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={() => handleSave(item.id)}
            >
              <Text style={styles.buttonText}>Mentés</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Mégse</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.buttonText}>Szerkesztés</Text>
          </TouchableOpacity>
        )}
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
            scrollEnabled={false}
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
  
  inputSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  inputText: {
    fontWeight: '600',
    color: '#555',
  },
  
  valueText: {
    color: '#333',
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 6,
    width: 80,
    textAlign: 'right',
  },
  
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  
  editButton: {
    backgroundColor: '#007AFF',
  },
  
  saveButton: {
    backgroundColor: '#34C759',
  },
  
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  
  orderDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
  
  separator: {
    height: 15,
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