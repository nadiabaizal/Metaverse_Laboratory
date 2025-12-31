import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../src/lib/supabase";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const inAuthGroup = pathname.startsWith("/(auth)");
      const isPasswordPage =
        pathname.includes("create-password") ||
        pathname.includes("new-password");

      // ❌ belum login → paksa ke login
      if (!session && !inAuthGroup) {
        router.replace("/(auth)/login");
        return;
      }

      // ❌ SUDAH LOGIN tapi masih di login/register → ke home
      if (session && inAuthGroup && !isPasswordPage) {
        router.replace("/(app)/(tabs)/home");
        return;
      }

      // ✅ BIARKAN create-password & new-password JALAN
    };

    checkSession();
  }, [pathname]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
