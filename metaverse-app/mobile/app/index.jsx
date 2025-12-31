import { Redirect } from "expo-router";

export default function Index() {
  // hanya jadi shortcut ke home tab
  return <Redirect href="/(app)/(tabs)/home" />;
}
