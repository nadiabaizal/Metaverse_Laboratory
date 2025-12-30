import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { spacing } from "../../../../src/theme/spacing";
import { colors } from "../../../../src/theme/colors";
import { getEventById } from "../../../../src/data/mockEvents";

export default function EventRegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = typeof params.id === "string" ? params.id : String(params.id ?? "1");
  const event = useMemo(() => getEventById(eventId), [eventId]);

  const [attending, setAttending] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [touchedSubmit, setTouchedSubmit] = useState(false);

  const isFormComplete =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    guests.trim().length > 0;

  const isEmailValid = /.+@.+\..+/.test(email.trim());
  const isGuestsValid = /^\d+$/.test(guests.trim());
  const isFormValid = isFormComplete && isEmailValid && isGuestsValid;

  const onSubmit = () => {
    setTouchedSubmit(true);
    if (!isFormValid) return;
    router.push(`/(app)/event/${eventId}/success`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Register</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* progress bar */}
      <View style={styles.progressRow}>
        <View style={[styles.progressLine, styles.progressActive]} />
        <View style={styles.progressLine} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.question} numberOfLines={2} ellipsizeMode="tail">
            Would you be attending the {event?.title || "..."} event?
          </Text>

          <View style={styles.choiceRow}>
            <TouchableOpacity style={styles.choice} onPress={() => setAttending(true)} activeOpacity={0.85}>
              <View style={[styles.radioOuter, attending && styles.radioOuterActive]}>
                {attending ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={[styles.choiceLabel, attending && styles.choiceLabelActive]}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.choice} onPress={() => setAttending(false)} activeOpacity={0.85}>
              <View style={[styles.radioOuter, !attending && styles.radioOuterActive]}>
                {!attending ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={[styles.choiceLabel, !attending && styles.choiceLabelActive]}>No</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="*****@mahasiswa.itb.ac.id"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. 0812345678"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>How many guest are you bringing?</Text>
            <TextInput
              value={guests}
              onChangeText={setGuests}
              placeholder="e.g. 2"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View style={{ height: 96 }} />
        </ScrollView>

        <View style={styles.footer}>
          {!isFormValid && touchedSubmit ? (
            <Text style={styles.errorText}>Please complete all fields correctly before submitting.</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryBtn, !isFormValid && styles.primaryBtnDisabled]}
            onPress={onSubmit}
            activeOpacity={0.9}
            disabled={!isFormValid}
          >
            <Text style={styles.primaryText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // spacing.js uses: s, m, l, xl, xxl
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.s,
  },
  backBtn: { width: 44, height: 44, alignItems: "flex-start", justifyContent: "center" },
  backText: { fontSize: 28, color: "#111827", lineHeight: 28 },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#111827" },

  progressRow: {
    flexDirection: "row",
    gap: spacing.l,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.l,
  },
  progressLine: {
    flex: 1,
    height: 3,
    borderRadius: 99,
    backgroundColor: "#D1D5DB",
  },
  progressActive: {
    backgroundColor: "#9B8CFF",
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
  },
  question: {
    fontSize: 16,
    color: "#111827",
    marginBottom: spacing.xl,
  },

  choiceRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 56,
    marginBottom: spacing.xl,
  },
  choice: { alignItems: "center", gap: 8 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: colors.primary ?? "#2E2A78",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primary ?? "#2E2A78",
  },
  choiceLabel: { fontSize: 14, color: "#111827" },
  choiceLabelActive: { color: colors.primary ?? "#2E2A78", fontWeight: "600" },

  field: { marginBottom: spacing.xl },
  label: { fontSize: 16, color: "#111827", marginBottom: spacing.m },
  input: {
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    paddingHorizontal: 16,
    fontSize: 18,
    color: "#111827",
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.m,
    backgroundColor: "white",
  },
  primaryBtn: {
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary ?? "#2E2A78",
  },
  primaryBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  primaryText: { color: "white", fontSize: 28, fontWeight: "800" },

  errorText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
});
