import { Stack } from "expo-router";
import { colors } from "../src/theme/colors";

export default function RootLayout() {
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
      <Stack.Screen name="(auth)/forgot-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/verification" options={{ title: "" }} />
      <Stack.Screen name="(auth)/create-password" options={{ title: "" }} />
      <Stack.Screen name="(auth)/new-password" options={{ title: "" }} />
      <Stack.Screen name="(app)/profile" options={{ title: "" }} />
    </Stack>
  );
}
