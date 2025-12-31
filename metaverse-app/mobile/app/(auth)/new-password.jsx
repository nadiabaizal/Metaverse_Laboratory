import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
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

export default function NewPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      // 🔐 update password user (session dari email reset link)
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      Alert.alert(
        "Sukses",
        "Password berhasil diubah. Silakan login kembali.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (e) {
      console.error("NEW PASSWORD ERROR:", e);
      Alert.alert("Gagal", e.message || "Gagal mengubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <Text style={styles.title}>New Password</Text>
        <Text style={styles.sub}>Enter your new password</Text>

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
          label="Confirm New Password"
          placeholder="Confirm New Password"
          value={watch("confirm")}
          onChangeText={(t) =>
            setValue("confirm", t, { shouldValidate: true })
          }
          secureTextEntry
          error={errors.confirm?.message}
        />

        <PrimaryButton
          title="Submit"
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
});
