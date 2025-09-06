import axios from "axios";
import React from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { API_BASE_URL } from "../config/api";
import { styles } from "../styles/MachineDetailsStyles";

interface OrderItemProps {
  item: any;
  editingOrderId: number | null;
  formData: {
    gross_weight: string;
    net_weight: string;
    cycle_time: string;
  };
  onEdit: (order: any) => void;
  onSave: (orderId: number) => void;
  onCancel: () => void;
  onInputChange: (field: string, value: string) => void;
  refreshData: () => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  item,
  editingOrderId,
  formData,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  refreshData
}) => {
  const handleSave = async (orderId: number) => {
    try {
      const payload = {
        gross_weight: formData.gross_weight ? parseFloat(formData.gross_weight) : null,
        net_weight: formData.net_weight ? parseFloat(formData.net_weight) : null,
        cycle_time: formData.cycle_time ? parseFloat(formData.cycle_time) : null,
      };

      await axios.put(`${API_BASE_URL}/orders/${orderId}`, payload);
      
      Alert.alert("Siker", "Adatok frissítve!");
      onSave(orderId);
      refreshData();
    } catch (error) {
      Alert.alert("Hiba", "Sikertelen frissítés");
      console.error(error);
    }
  };

  return (
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
              onChangeText={(value) => onInputChange('gross_weight', value)}
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
              onChangeText={(value) => onInputChange('net_weight', value)}
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
              onChangeText={(value) => onInputChange('cycle_time', value)}
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
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Mégse</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.editButton]}
            onPress={() => onEdit(item)}
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
};

export default OrderItem;