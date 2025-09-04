import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Főmenü</Text>

      <Link href="/machines" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Gépek</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/tools" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Szerszámok</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/orders" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Megrendelések</Text>
        </TouchableOpacity>
      </Link>
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
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 30 
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  }
});
