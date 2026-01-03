import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Linking from "expo-linking";

import AppBackground from "../../src/components/AppBackground";
import TextField from "../../src/components/TextField";
import PrimaryButton from "../../src/components/PrimaryButton";

import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";
import { forgotSchema } from "../../src/lib/validators";
import { supabase } from "../../src/lib/supabase";

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const redirectTo = Linking.createURL("/(auth)/new-password");

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;

      Alert.alert(
        "Email terkirim",
        "Silakan cek email kamu untuk reset password."
      );
    } catch (e) {
      console.error("FORGOT PASSWORD ERROR:", e);
      Alert.alert("Gagal", e.message || "Gagal mengirim email reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginBottom: spacing.xxl }}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.sub}>Enter your email</Text>
        </View>

        <TextField
          label="Email"
          placeholder="Email"
          value={watch("email")}
          onChangeText={(t) =>
            setValue("email", t, { shouldValidate: true })
          }
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email?.message}
        />

        <PrimaryButton
          title="Send Reset Email"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Back to </Text>
          <Link href="/(auth)/login" style={styles.link}>
            Log In
          </Link>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 140,
  },
  title: {
    ...type.h1,
    color: colors.white,
    marginBottom: 10,
  },
  sub: {
    ...type.h3,
    color: colors.white70,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  bottomText: {
    color: colors.white70,
  },
  link: {
    color: colors.link,
    fontWeight: "700",
  },
});
