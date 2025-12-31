import { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "../../src/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Ambil URL lengkap dari deep link
      const url = await Linking.getInitialURL();
      if (!url) {
        Alert.alert("Error", "Link tidak valid");
        return;
      }

      // Ambil token dari HASH (#)
      const hash = url.split("#")[1];
      if (!hash) {
        Alert.alert("Error", "Token tidak ditemukan di link");
        return;
      }

      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const type = params.get("type");

      if (!access_token || !refresh_token) {
        Alert.alert("Error", "Token tidak lengkap");
        return;
      }

      // 🔐 SET SESSION KE SUPABASE
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        Alert.alert("Session Error", error.message);
        return;
      }

      // 🔁 Arahkan sesuai flow
      if (type === "signup") {
        router.replace({
          pathname: "/(auth)/create-password",
          params: { access_token, refresh_token },
        });
      } else if (type === "recovery") {
        router.replace({
          pathname: "/(auth)/new-password",
          params: { access_token, refresh_token },
        });
      } else {
        router.replace("/(app)/(tabs)/home");
      }
    };

    handleCallback();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
