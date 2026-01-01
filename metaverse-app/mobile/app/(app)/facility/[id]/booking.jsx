import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { spacing } from "../../../../src/theme/spacing";
import { supabase } from "../../../../src/lib/supabase";

const PRIMARY = "#2D2A7B";

function Stepper({ step = 1 }) {
  const activeIdx = Math.max(1, Math.min(3, step)) - 1;
  return (
    <View style={styles.stepperRow}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.stepBar,
            i === activeIdx ? styles.stepBarActive : styles.stepBarInactive,
          ]}
        />
      ))}
    </View>
  );
}

function Radio({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.radioItem}>
      <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
        {active && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
}

export default function ToolBookingStep1() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [tool, setTool] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentNo, setStudentNo] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [campus, setCampus] = useState("ITB Ganesha");

  const onContinue = async () => {
    if (!name || !email || !studentNo || !whatsapp || !campus) {
      alert("Please complete all fields");
      return;
    }

    // 🔥 INSERT + AMBIL ID LANGSUNG
    const { data, error } = await supabase
      .from("facility_bookings")
      .insert({
        facility_id: id,
        name,
        email,
        student_number: studentNo, // ⬅️ SESUAI NAMA KOLOM
        whatsapp,
        campus,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("BOOKING INSERT ERROR:", error);
      alert("Failed to submit booking");
      return;
    }

    // ✅ LANGSUNG DAPAT booking_id
    router.push({
      pathname: "/(app)/facility/[id]/upload",
      params: {
        id: String(id),
        booking_id: data.id,
      },
    });
  };

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

      <Stepper step={1} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing.xl, paddingBottom: 140 }}
        >
          {!!tool && (
            <Text style={styles.toolHint} numberOfLines={2}>
              Booking for: <Text style={{ fontWeight: "900" }}>{tool.title}</Text>
            </Text>
          )}

          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="John Doe" />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="name@mahasiswa.itb.ac.id"
          />

          <Text style={styles.label}>Student Number</Text>
          <TextInput
            value={studentNo}
            onChangeText={setStudentNo}
            style={styles.input}
            keyboardType="number-pad"
            placeholder="e.g. 18223095"
          />

          <Text style={styles.label}>Whatsapp Number</Text>
          <TextInput
            value={whatsapp}
            onChangeText={setWhatsapp}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="e.g. 081375462214"
          />

          <Text style={[styles.label, { marginTop: spacing.xl }]}>Campus</Text>
          <View style={styles.radioRow}>
            <Radio label="ITB Ganesha" active={campus === "ITB Ganesha"} onPress={() => setCampus("ITB Ganesha")} />
            <Radio
              label="ITB Jatinangor"
              active={campus === "ITB Jatinangor"}
              onPress={() => setCampus("ITB Jatinangor")}
            />
            <Radio label="ITB Cirebon" active={campus === "ITB Cirebon"} onPress={() => setCampus("ITB Cirebon")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.primaryBtn} onPress={onContinue}>
          <Text style={styles.primaryBtnText}>Continue</Text>
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
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.2,
  },

  stepperRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    gap: 10,
    paddingBottom: spacing.l,
  },
  stepBar: { flex: 1, height: 3, borderRadius: 999 },
  stepBarActive: { backgroundColor: "#9C86FF" },
  stepBarInactive: { backgroundColor: "#D1D5DB" },

  toolHint: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: spacing.l,
  },

  label: { fontSize: 14, fontWeight: "800", color: "#111827", marginTop: spacing.l },
  input: {
    marginTop: 10,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#111827",
  },

  radioRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.m },
  radioItem: { alignItems: "center", gap: 8, width: "33%" },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: PRIMARY },
  radioInner: { width: 10, height: 10, borderRadius: 999, backgroundColor: "#F59E0B" },
  radioLabel: { fontSize: 13, fontWeight: "800", color: PRIMARY, textAlign: "center" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: 24,
  },
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
  primaryBtnText: { fontSize: 26, fontWeight: "900", color: "#FFFFFF" },
});
