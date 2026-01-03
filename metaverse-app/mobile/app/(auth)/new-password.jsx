import React, { useEffect, useState } from "react";
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
  const [checkingSession, setCheckingSession] = useState(true);

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

  /**
   * 🔑 TUNGGU SESSION DARI DEEP LINK
   */
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // kasih waktu Supabase memproses recovery token
      await new Promise((r) => setTimeout(r, 600));

      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!data.session) {
        Alert.alert(
          "Invalid link",
          "Link reset password tidak valid atau sudah kadaluarsa.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async (values) => {
    setLoading(true);

    const { password, confirm } = values;

    if (password !== confirm) {
      Alert.alert("Error", "Password tidak sama");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Success", "Password berhasil diubah", [
      {
        text: "OK",
        onPress: () => router.replace("/(auth)/login"),
      },
    ]);
  };

  // ⛔️ jangan render UI sebelum session valid
  if (checkingSession) return null;

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
