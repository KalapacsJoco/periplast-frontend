import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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