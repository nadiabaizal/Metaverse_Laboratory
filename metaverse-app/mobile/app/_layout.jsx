import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { supabase } from "../src/lib/supabase";
import { colors } from "../src/theme/colors";

// ✅ penting: inject token ke axios api
import { setAuthToken } from "../src/lib/api";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // sync token pertama kali app dibuka
    const syncToken = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      setAuthToken(session?.access_token || "");
    };
    syncToken();

    // sync token setiap auth berubah
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthToken(session?.access_token || "");
    });

    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      const inAuthGroup = segments[0] === "(auth)";

      // belum login → arahkan ke login
      if (!session && !inAuthGroup) {
        router.replace("/(auth)/login");
        return;
      }

      // sudah login
      if (session) {
        // (optional) kalau kamu punya flow password_set
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("password_set")
            .eq("id", session.user.id)
            .maybeSingle();

          if (profile && profile.password_set === false) {
            router.replace("/(auth)/create-password");
            return;
          }

          if (profile?.password_set && inAuthGroup) {
            router.replace("/(app)/(tabs)/home");
            return;
          }
        } catch (e) {
          // kalau table profiles tidak ada / belum siap, biarkan lanjut
          if (inAuthGroup) router.replace("/(app)/(tabs)/home");
        }
      }
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
      <Stack.Screen name="(auth)/login" options={{ title: "" }} />
      <Stack.Screen name="(auth)/register" options={{ title: "" }} />
      <Stack.Screen name="(auth)/verification" options={{ title: "" }} />
      <Stack.Screen name="(auth)/create-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/new-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/data" options={{ title: "" }} />
      <Stack.Screen name="(auth)/callback" options={{ title: "" }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
