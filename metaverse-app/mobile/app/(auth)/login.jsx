import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import AppBackground from "../../src/components/AppBackground";
import TextField from "../../src/components/TextField";
import PrimaryButton from "../../src/components/PrimaryButton";
import SocialButton from "../../src/components/SocialButton";
import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";
import { loginSchema } from "../../src/lib/validators";
import { api, setAuthToken } from "../../src/lib/api";
import BrandHeader from "../../src/components/BrandHeader";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { setValue, watch, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const email = watch("email");
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      setAuthToken(res.data.token);

      // kalau user belum complete profile -> arahkan ke profile
      if (!res.data.user?.profileCompleted) {
        router.replace("/(app)/profile");
      } else {
        // next: router.replace("/(app)/home") kalau sudah ada
        router.replace("/(app)/profile");
      }
    } catch (e) {
        const msg =
            e?.response?.data?.message ||
            e?.response?.data?.error ||
            e?.message ||
            "Login gagal";

        console.log("LOGIN ERROR:", {
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
        subtitle={
          <Text style={styles.subtitle}>
            Are you ready to <Text style={styles.subtitleStrong}>meetaverse</Text>? Let’s{" "}
            <Text style={styles.subtitleStrong}>Log In</Text>!
          </Text>
        }
      />

      <TextField
        label="Email"
        placeholder="Email"
        value={email}
        onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
        keyboardType="email-address"
        error={errors.email?.message}
      />

      <View style={{ marginBottom: spacing.l }}>
        <TextField
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={(t) => setValue("password", t, { shouldValidate: true })}
          secureTextEntry
          error={errors.password?.message}
        />
        <View style={styles.forgotRow}>
          <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>
        </View>
      </View>

      <PrimaryButton title="Log In" onPress={handleSubmit(onSubmit)} loading={loading} />

      <View style={styles.orRow}>
        <View style={styles.line} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialRow}>
        <SocialButton onPress={() => alert("Google login (todo)")}>
          <Ionicons name="logo-google" size={30} color={colors.white} />
        </SocialButton>
        <SocialButton onPress={() => alert("Facebook login (todo)")}>
          <Ionicons name="logo-facebook" size={30} color={colors.white} />
        </SocialButton>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.bottomText}>Don’t have an account yet? </Text>
        <Link href="/(auth)/register" style={styles.link}>
          Register
        </Link>
      </View>
    </View>
  </AppBackground>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 110 },
  subtitle: { color: colors.white70, textAlign: "center", lineHeight: 18 },
  subtitleStrong: { fontWeight: "800", color: colors.white },
  forgotRow: { alignItems: "flex-end", marginTop: -10 },
  link: { color: colors.link, fontWeight: "700" },
  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 18, gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.stroke },
  orText: { color: colors.white70, fontWeight: "600" },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 18, marginBottom: 26 },
  bottomRow: { flexDirection: "row", justifyContent: "center" },
  bottomText: { color: colors.white70 },
});