import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppBackground from "../../src/components/AppBackground";
import TextField from "../../src/components/TextField";
import PrimaryButton from "../../src/components/PrimaryButton";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";
import { forgotSchema } from "../../src/lib/validators";
import { api } from "../../src/lib/api";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { setValue, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const email = watch("email");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot/request-otp", data);
      router.push({ pathname: "/(auth)/verification", params: { email: data.email, mode: "reset" } });
    } catch (e) {
      alert(e?.response?.data?.message || "Gagal kirim OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginBottom: spacing.xxl }}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.sub}>Enter Email</Text>
        </View>

        <TextField
          label="Email"
          placeholder="Email"
          value={email}
          onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
          keyboardType="email-address"
          error={errors.email?.message}
        />

        <PrimaryButton title="Send" onPress={handleSubmit(onSubmit)} loading={loading} />

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Back to </Text>
          <Link href="/(auth)/login" style={styles.link}>Log In</Link>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 140 },
  title: { ...type.h1, color: colors.white, marginBottom: 10 },
  sub: { ...type.h3, color: colors.white70 },
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  bottomText: { color: colors.white70 },
  link: { color: colors.link, fontWeight: "700" },
});
