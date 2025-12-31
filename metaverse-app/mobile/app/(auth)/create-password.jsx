import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppBackground from "../../src/components/AppBackground";
import TextField from "../../src/components/TextField";
import PrimaryButton from "../../src/components/PrimaryButton";

import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";
import { passwordSchema } from "../../src/lib/validators";
import { supabase } from "../../src/lib/supabase";

export default function CreatePasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const password = watch("password");

  /**
   * 🔐 SET SESSION DARI TOKEN URL (WAJIB)
   */
  useEffect(() => {
    const initSession = async () => {
      const access_token = params.access_token;
      const refresh_token = params.refresh_token;

      if (!access_token || !refresh_token) {
        Alert.alert("Session error", "Token tidak ditemukan. Buka link dari email.");
        router.replace("/(auth)/login");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        Alert.alert("Session error", error.message);
        router.replace("/(auth)/login");
        return;
      }

      setSessionReady(true);
    };

    initSession();
  }, []);

  /**
   * 🔑 SIMPAN PASSWORD
   */
  const onSubmit = async () => {
    if (!sessionReady) {
      Alert.alert("Tunggu", "Session belum siap");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      const user = data.user;

      // ✅ pastikan profile ada (atau update)
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email,
          password_set: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (profileError) throw profileError;

      Alert.alert("Berhasil", "Password berhasil dibuat", [
        {
          text: "OK",
          onPress: () => router.replace("/(auth)/data"),
        },
      ]);
    } catch (e) {
      Alert.alert("Gagal", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Create Password</Text>
        <Text style={styles.sub}>Enter New Password</Text>

        <TextField
          label="New Password"
          placeholder="New Password"
          value={watch("password")}
          onChangeText={(t) =>
            setValue("password", t, { shouldValidate: true })
          }
          secureTextEntry
          error={errors.password?.message}
        />

        <TextField
          label="Confirm Password"
          placeholder="Confirm Password"
          value={watch("confirm")}
          onChangeText={(t) =>
            setValue("confirm", t, { shouldValidate: true })
          }
          secureTextEntry
          error={errors.confirm?.message}
        />

        <View style={styles.rules}>
          <Text style={styles.rule}>• 8 characters minimum</Text>
          <Text style={styles.rule}>• one lowercase letter</Text>
          <Text style={styles.rule}>• one number</Text>
          <Text style={styles.rule}>• one uppercase letter</Text>
        </View>

        <PrimaryButton
          title="Create Password"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 110,
  },
  title: {
    ...type.h1,
    color: colors.white,
    textAlign: "center",
    marginBottom: 18,
  },
  sub: {
    ...type.h2,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  rules: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: spacing.xl,
  },
  rule: {
    color: colors.white70,
    width: "48%",
  },
});
