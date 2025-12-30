import React, { useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../../../src/theme/spacing";
import { getEventById } from "../../../../src/data/mockEvents";

export default function EventSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "unity-vr";
  const event = useMemo(() => getEventById(eventId), [eventId]);

  const backToEvent = () => router.replace("/(app)/(tabs)/event");
  const checkStatus = () => router.push("/(app)/notification"); // simple: status via notifications

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tool’s Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressLine} />
        <View style={[styles.progressLine, styles.progressActive]} />
      </View>

      <View style={styles.center}>
        <Image source={require("../../../../assets/images/rogaOK.png")} style={styles.illustration} />
        <Text style={styles.successTitle}>Register Successful!</Text>
        <TouchableOpacity onPress={checkStatus} hitSlop={10}>
          <Text style={styles.link}>Check Status</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryBtn} onPress={backToEvent} activeOpacity={0.9}>
          <Text style={styles.primaryText}>Back to Event</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingTop: spacing.m,
    paddingHorizontal: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: { fontSize: 34, fontWeight: "900", color: "#111827" },

  progressRow: { flexDirection: "row", gap: 18, paddingHorizontal: spacing.l, marginTop: 12 },
  progressLine: { flex: 1, height: 3, borderRadius: 999, backgroundColor: "#D1D5DB" },
  progressActive: { backgroundColor: "#9C86FF" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.l },
  illustration: { width: 220, height: 293, resizeMode: "contain", marginBottom: 18 },
  successTitle: { fontSize: 32, fontWeight: "900", color: "#2D2A7B" },
  link: { marginTop: 10, fontSize: 22, fontWeight: "800", color: "#2563EB", textDecorationLine: "underline" },

  bottomBar: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
    paddingTop: spacing.m,
    backgroundColor: "#FFFFFF",
  },
  primaryBtn: {
    height: 78,
    borderRadius: 22,
    backgroundColor: "#2D2A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontSize: 30, fontWeight: "900", color: "#FFFFFF" },
});
