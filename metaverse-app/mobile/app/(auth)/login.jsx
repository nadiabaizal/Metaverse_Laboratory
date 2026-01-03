import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import AppBackground from "../../src/components/AppBackground";
import TextField from "../../src/components/TextField";
import PrimaryButton from "../../src/components/PrimaryButton";
import SocialButton from "../../src/components/SocialButton";
import BrandHeader from "../../src/components/BrandHeader";

import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";

import { loginSchema } from "../../src/lib/validators";
import { supabase } from "../../src/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // login sukses → langsung masuk app
      router.replace("/(app)/(tabs)/home");
    } catch (e) {
      console.error("LOGIN ERROR:", e);
      Alert.alert("Login gagal", e.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <BrandHeader
          subtitle={
            <Text style={styles.subtitle}>
              Are you ready to{" "}
              <Text style={styles.subtitleStrong}>meetaverse</Text>? Let’s{" "}
              <Text style={styles.subtitleStrong}>Log In</Text>!
            </Text>
          }
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

        <View style={{ marginBottom: spacing.l }}>
          <TextField
            label="Password"
            placeholder="Password"
            value={watch("password")}
            onChangeText={(t) =>
              setValue("password", t, { shouldValidate: true })
            }
            secureTextEntry
            error={errors.password?.message}
          />

          <View style={styles.forgotRow}>
            <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
              <Text style={styles.link}>Forgot Password?</Text>
            </Pressable>
          </View>
        </View>

        <PrimaryButton
          title="Log In"
          loading={loading}
          onPress={handleSubmit(onSubmit)}
        />

        <View style={styles.orRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* <View style={styles.socialRow}>
          <SocialButton onPress={() => Alert.alert("TODO", "Google login belum diimplementasikan")}>
            <Ionicons name="logo-google" size={30} color={colors.white} />
          </SocialButton>
          <SocialButton onPress={() => Alert.alert("TODO", "Facebook login belum diimplementasikan")}>
            <Ionicons name="logo-facebook" size={30} color={colors.white} />
          </SocialButton>
        </View> */}

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
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 110,
  },
  subtitle: {
    color: colors.white70,
    textAlign: "center",
    lineHeight: 18,
  },
  subtitleStrong: {
    fontWeight: "800",
    color: colors.white,
  },
  forgotRow: {
    alignItems: "flex-end",
    marginTop: -10,
  },
  link: {
    color: colors.link,
    fontWeight: "700",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.stroke,
  },
  orText: {
    color: colors.white70,
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginBottom: 26,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomText: {
    color: colors.white70,
  },
});
