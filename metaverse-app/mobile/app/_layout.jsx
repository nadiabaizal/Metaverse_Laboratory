import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { supabase } from "../src/lib/supabase";
import { colors } from "../src/theme/colors";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const checkedRef = useRef(false); // ⛔ cegah looping redirect

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
        }
      }

      checkedRef.current = true;
    };

    checkAuth();
  }, [segments]);

  return (
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
  );
}
