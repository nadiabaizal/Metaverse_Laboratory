import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../src/lib/supabase";
import { colors } from "../src/theme/colors";
import { setAuthToken } from "../src/lib/api";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  // 🔑 sync auth token ke axios
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthToken(data.session?.access_token || "");
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthToken(session?.access_token || "");
      }
    );

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  // 🔐 routing guard (DISESUAIKAN)
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      const inAuthGroup = segments[0] === "(auth)";
      const isCreatePassword = segments[1] === "create-password";
      const isProfileData = segments[1] === "data";

      // ❌ belum login → paksa ke login
      if (!session && !inAuthGroup) {
        router.replace("/(auth)/login");
        return;
      }

      // ✅ sudah login
      if (session) {
        // ⛔ IZINKAN halaman onboarding (create-password & data)
        if (isCreatePassword || isProfileData) return;

        // ❌ sudah login tapi masih di auth
        if (inAuthGroup) {
          router.replace("/(app)/(tabs)/home");
          return;
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
