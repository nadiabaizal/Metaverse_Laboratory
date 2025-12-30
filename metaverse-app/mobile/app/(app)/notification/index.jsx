import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "../../../src/theme/colors";
import { spacing } from "../../../src/theme/spacing";

/**
 * UI-only (dummy) notifications.
 * Nanti kalau sudah ada API, cukup ganti sumber data ini.
 */
const NOTIFICATIONS = [
  {
    id: "n1",
    dateLabel: "December 25, 2025",
    type: "success",
    title: "Event Registration Confirmed",
    subtitle: "Your registration is confirmed",
    body: "You have successfully registered for Building\nVirtual Worlds with Unity & VR.",
    time: "09:00 AM",
  },
  {
    id: "n2",
    dateLabel: "December 25, 2025",
    type: "reminder",
    title: "Tool Return Reminder",
    subtitle: "Return reminder",
    body: "Please return the Motion Capture Suit by May\n19, 2025.",
    time: "09:30 AM",
  },
  {
    id: "n3",
    dateLabel: "December 23, 2025",
    type: "reminder",
    title: "Event Reminder",
    subtitle: "Upcoming event tomorrow",
    body: "Don’t forget to attend Metaverse 101 : The\nFuture of Digital Interaction.",
    time: "04:20 PM",
  },
  {
    id: "n4",
    dateLabel: "December 23, 2025",
    type: "success",
    title: "Tool Booking Approved",
    subtitle: "Tool booking approved",
    body: "Your booking request for Oculus Quest 2 has\nbeen approved.",
    time: "10:00 AM",
  },
  {
    id: "n5",
    dateLabel: "December 23, 2025",
    type: "reminder",
    title: "New Event Available",
    subtitle: "New event published",
    body: "Check out our latest event: Career &\nResearch Pathways in Metaverse.",
    time: "11:00 AM",
  },
  {
    id: "n6",
    dateLabel: "November 20, 2022",
    type: "reminder",
    title: "Welcome to Metaverse Laboratory",
    subtitle: "Getting started",
    body: "Explore facilities, events, and projects\nfrom the Home tab.",
    time: "09:15 AM",
  },
];

function getIcon(type) {
  if (type === "success") return { name: "checkmark" };
  return { name: "notifications-outline" };
}

function DateSection({ label }) {
  return <Text style={styles.dateHeader}>{label}</Text>;
}

function NotificationItem({ item, onPress }) {
  const icon = getIcon(item.type);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon.name} size={28} color={colors.primaryDark} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.time}>Time : {item.time}</Text>
      </View>
    </Pressable>
  );
}

export default function NotificationScreen() {
  const router = useRouter();

  const grouped = useMemo(() => {
    /** @type {Record<string, typeof NOTIFICATIONS>} */
    const map = {};
    for (const n of NOTIFICATIONS) {
      if (!map[n.dateLabel]) map[n.dateLabel] = [];
      map[n.dateLabel].push(n);
    }
    // Keep original order of date appearance
    const order = [];
    for (const n of NOTIFICATIONS) {
      if (!order.includes(n.dateLabel)) order.push(n.dateLabel);
    }
    return order.map((k) => ({ dateLabel: k, items: map[k] }));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={stylesVars.textDark} />
        </Pressable>

        <Text style={styles.headerTitle}>Notification</Text>

        {/* Spacer biar title tetap center */}
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {grouped.map((section) => (
          <View key={section.dateLabel} style={styles.section}>
            <DateSection label={section.dateLabel} />
            {section.items.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onPress={() => {
                  // TODO: arahkan ke detail (event/tool) saat sudah ada routing
                }}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesVars = {
  bg: "#FFFFFF",
  textDark: "#111827",
  text: "#374151",
  muted: "#9CA3AF",
  divider: "rgba(17,24,39,0.08)",
  circleBg: "rgba(156, 134, 255, 0.25)",
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: stylesVars.bg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: stylesVars.textDark,
  },
  headerRightSpacer: {
    width: 40,
    height: 40,
  },

  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  section: {
    paddingTop: spacing.l,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: stylesVars.textDark,
    marginBottom: spacing.m,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.l,
    paddingVertical: spacing.l,
  },
  rowPressed: {
    opacity: 0.7,
  },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: stylesVars.circleBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingBottom: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: stylesVars.divider,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: stylesVars.textDark,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: stylesVars.muted,
    marginBottom: 6,
  },
  body: {
    fontSize: 16,
    fontWeight: "500",
    color: stylesVars.muted,
    lineHeight: 22,
  },
  time: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "800",
    color: stylesVars.muted,
  },
});
