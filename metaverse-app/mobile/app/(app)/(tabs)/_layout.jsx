import { Tabs } from "expo-router";
import CustomTabBar from "../../../src/components/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* ⚠️ URUTAN TAB PENTING – JANGAN DIUBAH */}
      <Tabs.Screen
        name="facility"
        options={{
          title: "Facility",
        }}
      />

      <Tabs.Screen
        name="event"
        options={{
          title: "Event",
        }}
      />

      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="project"
        options={{
          title: "Project",
        }}
      />

      <Tabs.Screen
        name="organization"
        options={{
          title: "Organization",
        }}
      />
    </Tabs>
  );
}
