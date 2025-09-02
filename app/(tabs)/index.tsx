import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

type Machine = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export default function Index() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Starting API call to: http://192.168.0.104:8000/api/machines");
    
    axios
      .get("http://192.168.0.104:8000/api/machines") 
      .then((res) => {
        console.log("API Response received:", res.data);
        console.log("Response status:", res.status);
        setMachines(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("API Error details:", err);
        console.error("Error code:", err.code);
        console.error("Error message:", err.message);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
        console.log("API call completed");
      });
  }, []);

  console.log("Current machines state:", machines);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Gépek betöltése...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Hiba: {error}</Text>
        <Text style={styles.suggestion}>
          Ellenőrizze a szerver kapcsolatot
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gépek</Text>
      <FlatList
        data={machines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>{item.name}</Text>
            <Text style={styles.meta}>ID: {item.id}</Text>
            <Text style={styles.meta}>Létrehozva: {item.created_at}</Text>
            <Text style={styles.meta}>Módosítva: {item.updated_at}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
  itemContainer: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    width: 300,
  },
  item: { 
    fontSize: 18, 
    fontWeight: "bold",
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: "#555",
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  suggestion: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});