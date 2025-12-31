import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AppBackground from "../../src/components/AppBackground";
import TextField from "../../src/components/TextField";
import PrimaryButton from "../../src/components/PrimaryButton";

import { colors } from "../../src/theme/colors";
import { spacing } from "../../src/theme/spacing";
import { type } from "../../src/theme/typography";

import { profileSchema } from "../../src/lib/validators";
import { supabase } from "../../src/lib/supabase";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      nik: "",
      birthDate: "",
      address: "",
    },
  });

  // 🔹 prefill email → profile opsional
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        setValue("fullName", profile.name || "");
        setValue("nik", profile.nik || "");
        setValue("birthDate", profile.birth_date || "");
        setValue("address", profile.address || "");
      }
    })();
  }, []);

  const onSubmit = async (form) => {
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError || !data?.user) {
        Alert.alert("Error", "User belum login");
        return;
      }

      const user = data.user;

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          name: form.fullName,
          nik: form.nik || null,
          birth_date: form.birthDate || null,
          address: form.address || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) throw error;

      router.replace("/(app)/(tabs)/home");
    } catch (e) {
      Alert.alert("Gagal", e.message || "Gagal menyimpan profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={styles.sub}>Lengkapi sekarang atau lewati</Text>

        <Text style={styles.section}>Information</Text>

        <TextField
          label="Full Name"
          placeholder="Full Name"
          value={watch("fullName")}
          onChangeText={(t) =>
            setValue("fullName", t, { shouldValidate: true })
          }
          error={errors.fullName?.message}
        />

        <TextField
          label="NIK"
          placeholder="NIK"
          value={watch("nik")}
          onChangeText={(t) => setValue("nik", t, { shouldValidate: true })}
          keyboardType="number-pad"
          error={errors.nik?.message}
        />

        <TextField
          label="Birth Date"
          placeholder="YYYY-MM-DD"
          value={watch("birthDate")}
          onChangeText={(t) =>
            setValue("birthDate", t, { shouldValidate: true })
          }
          rightIcon={
            <Ionicons
              name="calendar-outline"
              size={22}
              color={colors.white70}
            />
          }
          onRightIconPress={() =>
            Alert.alert("Info", "Date picker belum diimplementasikan")
          }
          error={errors.birthDate?.message}
        />

        <TextField
          label="Address"
          placeholder="Address"
          value={watch("address")}
          onChangeText={(t) =>
            setValue("address", t, { shouldValidate: true })
          }
          error={errors.address?.message}
        />

        <View style={styles.actions}>
          <Pressable
            onPress={() => router.replace("/(app)/(tabs)/home")}
            style={styles.skipBtn}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>

          <View style={{ flex: 1 }}>
            <PrimaryButton
              title="Continue"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 100,
  },
  title: {
    ...type.h1,
    color: colors.white,
    textAlign: "center",
  },
  sub: {
    color: colors.white70,
    marginTop: 8,
    textAlign: "center",
  },
  section: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.white,
    textAlign: "center",
    marginVertical: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginTop: 18,
  },
  skipBtn: {
    width: 140,
    height: 58,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "800",
  },
});
