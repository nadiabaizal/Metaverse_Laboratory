import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { supabase } from "../src/lib/supabase";
import { colors } from "../src/theme/colors";
import { setAuthToken } from "../src/lib/api";

/**
 * 🔑 LINKING CONFIG (WAJIB UNTUK RESET PASSWORD)
 */
const linking = {
  prefixes: [
    Linking.createURL("/"), // exp://192.xxx.xxx.xxx:8000
    "sametaverse://",       // production nanti
  ],
  config: {
    screens: {
      "(auth)": {
        screens: {
          "login": "(auth)/login",
          "forgot-password": "(auth)/forgot-password",
          "new-password": "(auth)/new-password",
          "create-password": "(auth)/create-password",
          "data": "(auth)/data",
        },
      },
      "(app)": "(app)",
    },
  },
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  /**
   * 🔑 Sync auth token ke axios
   */
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
      listener?.subscription?.unsubscribe();
    };
  }, []);

  /**
   * 🔐 ROUTING GUARD (SUDAH DIBETULKAN)
   * - IZINKAN new-password walaupun belum login
   */
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      const inAuthGroup = segments[0] === "(auth)";
      const route = segments[1];

      const allowWithoutSession = [
        "login",
        "forgot-password",
        "new-password",     // ✅ PENTING
        "create-password",
      ];

      // ❌ belum login & bukan halaman auth
      if (!session && !inAuthGroup) {
        router.replace("/(auth)/login");
        return;
      }

      // ❌ belum login tapi masuk auth → cek apakah diizinkan
      if (!session && inAuthGroup) {
        if (!allowWithoutSession.includes(route)) {
          router.replace("/(auth)/login");
        }
        return;
      }

      // ✅ sudah login tapi masih di auth → lempar ke app
      if (session && inAuthGroup) {
        router.replace("/(app)/(tabs)/home");
      }
    };

    checkAuth();
  }, [segments]);

  return (
    <Stack
      linking={linking}   // 🔥 INI KUNCINYA
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
      <Stack.Screen name="(auth)/forgot-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/create-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/new-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/data" options={{ title: "" }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}
