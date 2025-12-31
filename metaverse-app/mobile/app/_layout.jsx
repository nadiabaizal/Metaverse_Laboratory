import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../src/lib/supabase";
import { colors } from "../src/theme/colors";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("password_set")
        .eq("id", session.user.id)
        .maybeSingle();

      // WAJIB isi password dulu
      if (profile && profile.password_set === false) {
        router.replace("/(auth)/create-password");
        return;
      }

      // Sudah login & onboarding selesai
      if (profile?.password_set && inAuthGroup) {
        router.replace("/(app)/(tabs)/home");
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
      {/* AUTH */}
      <Stack.Screen name="(auth)/login" options={{ title: "" }} />
      <Stack.Screen name="(auth)/register" options={{ title: "" }} />
      <Stack.Screen name="(auth)/verification" options={{ title: "" }} />
      <Stack.Screen name="(auth)/create-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/new-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/data" options={{ title: "" }} />
      <Stack.Screen name="(auth)/callback" options={{ title: "" }} />

      {/* APP */}
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
