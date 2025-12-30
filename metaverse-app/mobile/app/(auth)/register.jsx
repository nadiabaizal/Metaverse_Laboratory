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
import { registerSchema } from "../../src/lib/validators";
import { api } from "../../src/lib/api";
import BrandHeader from "../../src/components/BrandHeader";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { setValue, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "" },
  });

  const email = watch("email");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/register/request-otp", data);
      router.push({
        pathname: "/(auth)/verification",
        params: { email: data.email, mode: "register" },
      });
    } catch (e) {
    const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Gagal register";

    console.log("REGISTER ERROR:", {
        message: e?.message,
        status: e?.response?.status,
        data: e?.response?.data,
    });

    alert(msg);
    }finally {
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
          value={email}
          onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
          keyboardType="email-address"
          error={errors.email?.message}
        />

        <PrimaryButton title="Register" onPress={handleSubmit(onSubmit)} loading={loading} />

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
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 120 },
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 22 },
  bottomText: { color: colors.white70 },
  link: { color: colors.link, fontWeight: "700" },
});
