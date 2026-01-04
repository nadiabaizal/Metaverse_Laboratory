import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { supabase } from "../src/lib/supabase";
import { colors } from "../src/theme/colors";

// ✅ Splash overlay component (buat file ini di app/Splash.jsx)
import Splash from "./Splash";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const checkedRef = useRef(false); // ⛔ cegah looping redirect

  // ✅ Splash overlay state
  const [showSplash, setShowSplash] = useState(true);

  // ✅ Sembunyikan splash setelah beberapa saat (atau ketika Splash selesai)
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 7000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (checkedRef.current) return;

      const currentRoute = segments.join("/");

      // ✅ route yang BOLEH TANPA SESSION
      const allowWithoutSession = [
        "(auth)/login",
        "(auth)/register",
        "(auth)/verification",
        "(auth)/callback",
        "(auth)/create-password",
        "(auth)/new-password",
        "(auth)/data",
      ];

      if (allowWithoutSession.includes(currentRoute)) {
        checkedRef.current = true;
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const inAuthGroup = segments[0] === "(auth)";

      // ❌ belum login → paksa ke login
      if (!session && !inAuthGroup) {
        checkedRef.current = true;
        router.replace("/(auth)/login");
        return;
      }

      if (session) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("password_set")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.warn("Profile fetch error:", error.message);
          checkedRef.current = true;
          return;
        }

        // ❗ WAJIB isi password dulu
        if (profile?.password_set === false) {
          checkedRef.current = true;
          router.replace("/(auth)/create-password");
          return;
        }

        // ✅ sudah login + onboarding selesai
        if (profile?.password_set && inAuthGroup) {
          checkedRef.current = true;
          router.replace("/(app)/(tabs)/home");
          return;
        }
      }

      checkedRef.current = true;
    };

    checkAuth();
  }, [segments, router]);

  return (
    <View style={styles.root}>
      {/* Status bar untuk splash overlay (gelap) */}
      <StatusBar barStyle={showSplash ? "light-content" : "dark-content"} />

      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitleStyle: { color: colors.white, fontWeight: "700" },
          headerTintColor: colors.white,
          headerBackTitleVisible: false,
        }}
      >
        {/* AUTH */}
        <Stack.Screen name="(auth)/login" options={{ title: "" }} />
        <Stack.Screen name="(auth)/register" options={{ title: "" }} />
        <Stack.Screen name="(auth)/verification" options={{ title: "" }} />
        <Stack.Screen name="(auth)/callback" options={{ title: "" }} />
        <Stack.Screen name="(auth)/create-password" options={{ title: "" }} />
        <Stack.Screen name="(auth)/new-password" options={{ title: "" }} />
        <Stack.Screen name="(auth)/data" options={{ title: "" }} />

        {/* APP */}
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>

      {/* ✅ Splash overlay animasi (tidak mengganggu navigasi) */}
      {showSplash && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Splash onFinish={() => setShowSplash(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
});
