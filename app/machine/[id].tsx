import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View
} from "react-native";
import MachineHeader from "../../components/MachineHeader";
import OrderItem from "../../components/OrderItems";
import { API_BASE_URL } from "../../config/api";
import { styles } from "../../styles/MachineDetailsStyles";

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
      .get(`${API_BASE_URL}/machines/${id}`)
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

  const handleSave = (orderId: number) => {
    setEditingOrderId(null);
  };

  const handleCancel = () => {
    setEditingOrderId(null);
    setFormData({ gross_weight: "", net_weight: "", cycle_time: "" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <OrderItem
      item={item}
      editingOrderId={editingOrderId}
      formData={formData}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onInputChange={handleInputChange}
      refreshData={fetchMachineData}
    />
  );

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  if (error) return <Text>Hiba: {error}</Text>;
  if (!machine) return <Text>Nincs adat</Text>;

  return (
    <ScrollView style={styles.container}>
      <MachineHeader machine={machine} />

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