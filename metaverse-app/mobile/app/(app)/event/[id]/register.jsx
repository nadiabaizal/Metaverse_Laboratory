import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../../../src/theme/spacing";
import { getEventById } from "../../../../src/data/mockEvents";

export default function EventRegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "unity-vr";
  const event = useMemo(() => getEventById(eventId), [eventId]);

  const [attending, setAttending] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("");

  const submit = () => {
    // UI only: assume success
    router.replace({ pathname: "/(app)/event/[id]/success", params: { id: event.id } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Register</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressLine, styles.progressActive]} />
        <View style={styles.progressLine} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: spacing.l, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.question} numberOfLines={1}>
            Would you be attending the ... event?
          </Text>

          <View style={styles.radioRow}>
            <Radio label="Yes" active={attending} onPress={() => setAttending(true)} />
            <Radio label="No" active={!attending} onPress={() => setAttending(false)} />
          </View>

          <Field label="Name" value={name} onChangeText={setName} placeholder="John Doe" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="*****@mahasiswa.itb.ac.id" keyboardType="email-address" />
          <Field label="Phone Number" value={phone} onChangeText={setPhone} placeholder="e.g. 0812345678" keyboardType="phone-pad" />
          <Field label="How many guest are you bringing?" value={guestCount} onChangeText={setGuestCount} placeholder="e.g. 2" keyboardType="number-pad" />
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.submitBtn} onPress={submit} activeOpacity={0.9}>
            <Text style={styles.submitText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Radio({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.radioItem} activeOpacity={0.85}>
      <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
        {active ? <View style={styles.radioInner} /> : null}
      </View>
      <Text style={[styles.radioLabel, active && styles.radioLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={{ marginTop: 22 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
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

  question: { marginTop: 24, fontSize: 16, fontWeight: "700", color: "#111827" },

  radioRow: { marginTop: 18, flexDirection: "row", justifyContent: "center", gap: 70 },
  radioItem: { alignItems: "center", gap: 8 },
  radioOuter: {
    width: 26,
    height: 26,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: "#2D2A7B" },
  radioInner: { width: 14, height: 14, borderRadius: 14, backgroundColor: "#2D2A7B" },
  radioLabel: { fontSize: 16, fontWeight: "900", color: "#111827" },
  radioLabelActive: { color: "#2D2A7B" },

  fieldLabel: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 10 },
  input: {
    height: 58,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    paddingHorizontal: 16,
    fontSize: 18,
    color: "#111827",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
    paddingTop: spacing.m,
    backgroundColor: "rgba(255,255,255,0.96)",
  },
  submitBtn: {
    height: 74,
    borderRadius: 20,
    backgroundColor: "#2D2A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { fontSize: 30, fontWeight: "900", color: "#FFFFFF" },
});
