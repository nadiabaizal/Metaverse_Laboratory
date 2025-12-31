import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppBackground from "../../src/components/AppBackground";
import TextField from "../../src/components/TextField";
import PrimaryButton from "../../src/components/PrimaryButton";
import BrandHeader from "../../src/components/BrandHeader";

import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { registerSchema } from "../../src/lib/validators";
import { supabase } from "../../src/lib/supabase";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
          options: {
          emailRedirectTo: "https://samuelchris16.github.io/Redirecting-Metaverse-Lab-App-Dev/create-password.html",
          }
      });

      if (error) throw error;

      Alert.alert(
        "Check your email",
        "A verification link has been sent to your email address. Please check your inbox."
      );
    } catch (e) {
      console.error("REGISTER ERROR:", e);
      Alert.alert("Register gagal", e.message || "Gagal membuat akun");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <BrandHeader
          showWelcome={false}
          brand="Register"
          subtitle="Create new account!"
        />

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
          title="Register"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>
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
    paddingTop: 120,
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
