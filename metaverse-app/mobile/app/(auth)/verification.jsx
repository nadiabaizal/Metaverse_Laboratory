import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";

import AppBackground from "../../src/components/AppBackground";
import PrimaryButton from "../../src/components/PrimaryButton";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";
import { supabase } from "../../src/lib/supabase";

export default function VerificationScreen() {
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Email tidak ditemukan");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: "metaverselaboratory://login-callback",
        },
      });

      if (error) throw error;

      Alert.alert(
        "OTP Terkirim",
        "Silakan cek email kamu dan klik link untuk melanjutkan."
      );
    } catch (e) {
      Alert.alert("Gagal", e.message || "Gagal mengirim OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Verification</Text>

        <Text style={styles.big}>Check Your Email</Text>
        <Text style={styles.sub}>
          We’ve sent a verification link to{" "}
          <Text style={{ fontWeight: "800", color: colors.white }}>
            {email}
          </Text>
        </Text>

        <View style={{ marginTop: spacing.xl }}>
          <PrimaryButton
            title="Send Verification Email"
            onPress={sendOtp}
            loading={loading}
          />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 110 },
  title: { ...type.h1, color: colors.white, textAlign: "center", marginBottom: 26 },
  big: { fontSize: 34, fontWeight: "800", color: colors.white, marginBottom: 10 },
  sub: { color: colors.white70, lineHeight: 18 },
});
