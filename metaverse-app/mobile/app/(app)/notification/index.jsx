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
import { useEffect, useState } from "react";
import { supabase } from "../../../src/lib/supabase";


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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }
    setLoading(false);
  };

  const grouped = useMemo(() => {
    const map = {};

    notifications.forEach((n) => {
      const dateLabel = new Date(n.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      });

      if (!map[dateLabel]) map[dateLabel] = [];

      map[dateLabel].push({
        ...n,
        time: new Date(n.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    });

    return Object.keys(map).map((k) => ({
      dateLabel: k,
      items: map[k],
    }));
  }, [notifications]);

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
