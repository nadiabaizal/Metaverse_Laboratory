import React, { useMemo } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { spacing } from "../../../../src/theme/spacing";
import { getFacilityById } from "../../../../src/data/mockFacilities";

const PRIMARY = "#2D2A7B";

export default function ToolBookingSuccess() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tool = useMemo(() => getFacilityById(String(id)), [id]);

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>Tool’s Booking</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Step 3 */}
      <View style={styles.stepperRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.stepBar, i === 2 ? styles.stepBarActive : styles.stepBarInactive]} />
        ))}
      </View>

      <View style={styles.center}>
        <Image source={require("../../../../assets/images/rogaOK.png")} style={styles.mascot} resizeMode="contain" />

        <Text style={styles.successTitle}>Booking Successful!</Text>
        <Pressable onPress={() => router.push({ pathname: "/(app)/profile/history" })} hitSlop={8}>
          <Text style={styles.linkText}>Check Status</Text>
        </Pressable>

        {!!tool && (
          <Text style={styles.hint}>
            {tool.title} — {tool.available} left (dummy)
          </Text>
        )}
      </View>

      <View style={styles.bottomBar}>
        <Pressable style={styles.primaryBtn} onPress={() => router.replace("/(app)/(tabs)/facility")}>
          <Text style={styles.primaryBtnText}>Back to Facility</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  safe: { backgroundColor: "#FFFFFF" },

  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#111827", letterSpacing: 0.2 },

  stepperRow: { flexDirection: "row", paddingHorizontal: spacing.xl, gap: 10, paddingBottom: spacing.l },
  stepBar: { flex: 1, height: 3, borderRadius: 999 },
  stepBarActive: { backgroundColor: "#9C86FF" },
  stepBarInactive: { backgroundColor: "#D1D5DB" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  mascot: { width: 240, height: 240, marginBottom: spacing.l },

  successTitle: { fontSize: 30, fontWeight: "900", color: PRIMARY, textAlign: "center" },
  linkText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "900",
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
  hint: { marginTop: spacing.l, color: "#6B7280", fontWeight: "700", textAlign: "center" },

  bottomBar: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.xl, paddingBottom: 24 },
  primaryBtn: {
    height: 76,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  primaryBtnText: { fontSize: 24, fontWeight: "900", color: "#FFFFFF" },
});
