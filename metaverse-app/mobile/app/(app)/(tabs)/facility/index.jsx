import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FacilityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facility</Text>
      <Text style={styles.sub}>Halaman Facility (placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "900" },
  sub: { marginTop: 8, fontSize: 14, fontWeight: "600", opacity: 0.6 },
});
