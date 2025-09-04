import { StyleSheet, Text, View } from "react-native";

export default function Tools() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Szerszámok oldal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
});
