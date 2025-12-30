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
import { api, setAuthToken } from "../../src/lib/api";

export default function CreatePasswordScreen() {
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
      const res = await api.post("/auth/register/set-password", {
        email,
        resetToken,
        password: data.password,
      });
      setAuthToken(res.data.token);
      router.replace("/(app)/profile");
    } catch (e) {
      alert(e?.response?.data?.message || "Gagal set password");
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
          value={password}
          onChangeText={(t) => setValue("password", t, { shouldValidate: true })}
          secureTextEntry
          error={errors.password?.message}
        />

        <TextField
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={(t) => setValue("confirm", t, { shouldValidate: true })}
          secureTextEntry
          error={errors.confirm?.message}
        />

        <View style={styles.rules}>
          <Text style={styles.rule}>• 8 characters minimum</Text>
          <Text style={styles.rule}>• one lowercase letter</Text>
          <Text style={styles.rule}>• one number</Text>
          <Text style={styles.rule}>• one uppercase letter</Text>
        </View>

        <PrimaryButton title="Create Password" onPress={handleSubmit(onSubmit)} loading={loading} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 110 },
  title: { ...type.h1, color: colors.white, textAlign: "center", marginBottom: 18 },
  sub: { ...type.h2, color: colors.white, textAlign: "center", marginBottom: spacing.xl },
  rules: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: spacing.xl },
  rule: { color: colors.white70, width: "48%" },
});
