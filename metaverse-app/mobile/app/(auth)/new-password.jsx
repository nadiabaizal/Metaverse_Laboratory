import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AppBackground from "../../src/components/AppBackground";
import TextField from "../../src/components/TextField";
import PrimaryButton from "../../src/components/PrimaryButton";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";
import { passwordSchema } from "../../src/lib/validators";
import { api } from "../../src/lib/api";

export default function NewPasswordScreen() {
  const router = useRouter();
  const { email, resetToken } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const { setValue, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const password = watch("password");
  const confirm = watch("confirm");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot/set-new-password", {
        email,
        resetToken,
        password: data.password,
      });
      alert("Password berhasil diubah. Silakan login.");
      router.replace("/(auth)/login");
    } catch (e) {
      alert(e?.response?.data?.message || "Gagal ubah password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <Text style={styles.title}>New Password</Text>
        <Text style={styles.sub}>Enter New Password</Text>

        <TextField
          label="New Password"
          placeholder="New Password"
          value={password}
          onChangeText={(t) => setValue("password", t, { shouldValidate: true })}
          secureTextEntry
          error={errors.password?.message}
        />

        <TextField
          label="Confirm New Password"
          placeholder="Confirm New Password"
          value={confirm}
          onChangeText={(t) => setValue("confirm", t, { shouldValidate: true })}
          secureTextEntry
          error={errors.confirm?.message}
        />

        <PrimaryButton title="Submit" onPress={handleSubmit(onSubmit)} loading={loading} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 110 },
  title: { ...type.h1, color: colors.white, textAlign: "center", marginBottom: 18 },
  sub: { ...type.h2, color: colors.white, textAlign: "center", marginBottom: spacing.xl },
});
