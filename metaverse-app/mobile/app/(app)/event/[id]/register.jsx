import React, { useState } from "react";
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
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { spacing } from "../../../../src/theme/spacing";
import { colors } from "../../../../src/theme/colors";
import { supabase } from "../../../../src/lib/supabase";

export default function EventRegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = typeof params.id === "string" ? params.id : String(params.id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [loading, setLoading] = useState(false);
  const [touchedSubmit, setTouchedSubmit] = useState(false);

  const isFormComplete =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    guests.trim().length > 0;

  const isEmailValid = /.+@.+\..+/.test(email.trim());
  const isGuestsValid = /^\d+$/.test(guests.trim());
  const isFormValid = isFormComplete && isEmailValid && isGuestsValid;

  const onSubmit = async () => {
    setTouchedSubmit(true);
    if (!isFormValid || loading) return;

    setLoading(true);

    const { error } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        email: email.trim(),
        phone_num: phone.trim(),
        guest_count: Number(guests),
      });

    setLoading(false);

    if (error) {
      console.error("REGISTER ERROR:", error);
      Alert.alert("Register failed", error.message);
      return;
    }

    router.replace(`/(app)/event/${eventId}/success`);
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

      <View style={styles.progressRow}>
        <View style={[styles.progressLine, styles.progressActive]} />
        <View style={styles.progressLine} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
              placeholder="example@email.com"
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
              placeholder="08123456789"
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
          {!isFormValid && touchedSubmit && (
            <Text style={styles.errorText}>
              Please complete all fields correctly before submitting.
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              (!isFormValid || loading) && styles.primaryBtnDisabled,
            ]}
            onPress={onSubmit}
            activeOpacity={0.9}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.primaryText}>
              {loading ? "Submitting..." : "Register"}
            </Text>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.s,
  },
  backBtn: { width: 44, height: 44, justifyContent: "center" },
  backText: { fontSize: 28, color: "#111827" },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#111827" },

  progressRow: {
    flexDirection: "row",
    gap: spacing.l,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.l,
  },
  progressLine: { flex: 1, height: 3, borderRadius: 99, backgroundColor: "#D1D5DB" },
  progressActive: { backgroundColor: "#9B8CFF" },

  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.l },

  field: { marginBottom: spacing.xl },
  label: { fontSize: 16, marginBottom: spacing.m },
  input: {
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    paddingHorizontal: 16,
    fontSize: 18,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.m,
  },
  primaryBtn: {
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary ?? "#2E2A78",
  },
  primaryBtnDisabled: { backgroundColor: "#9CA3AF" },
  primaryText: { color: "white", fontSize: 28, fontWeight: "800" },

  errorText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
});
