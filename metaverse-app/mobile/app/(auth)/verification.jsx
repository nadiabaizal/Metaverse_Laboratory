import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import AppBackground from "../../src/components/AppBackground";
import OTPInput from "../../src/components/OTPInput";
import PrimaryButton from "../../src/components/PrimaryButton";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";
import { api } from "../../src/lib/api";

export default function VerificationScreen() {
  const router = useRouter();
  const { email, mode } = useLocalSearchParams(); // mode: register | reset
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (code.length !== 4) return alert("OTP harus 4 digit");
    setLoading(true);
    try {
      const res = await api.post("/auth/otp/verify", { email, code, mode });
      // backend mengembalikan token sementara untuk set password
      const resetToken = res.data.resetToken;

      if (mode === "register") {
        router.replace({ pathname: "/(auth)/create-password", params: { email, resetToken } });
      } else {
        router.replace({ pathname: "/(auth)/new-password", params: { email, resetToken } });
      }
    } catch (e) {
        const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "OTP salah";

        console.log("OTP ERROR:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
        });

        alert(msg);} finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      if (mode === "register") await api.post("/auth/register/request-otp", { email });
      else await api.post("/auth/forgot/request-otp", { email });
      alert("OTP dikirim ulang");
    } catch (e) {
      alert(e?.response?.data?.message || "Gagal resend");
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Verification</Text>

        <Text style={styles.big}>Enter OTP Code</Text>
        <Text style={styles.sub}>
          We have send the OTP on <Text style={{ fontWeight: "800", color: colors.white }}>{email}</Text>
        </Text>

        <View style={{ marginTop: spacing.xl }}>
          <OTPInput value={code} onChange={setCode} />
        </View>

        <Text onPress={onResend} style={styles.didnt}>Didn’t got the code?</Text>

        <PrimaryButton title="Re-Send" onPress={onVerify} loading={loading} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 110 },
  title: { ...type.h1, color: colors.white, textAlign: "center", marginBottom: 26 },
  big: { fontSize: 34, fontWeight: "800", color: colors.white, marginBottom: 10 },
  sub: { color: colors.white70, lineHeight: 18 },
  didnt: { textAlign: "center", color: colors.white70, marginVertical: 16 },
});
