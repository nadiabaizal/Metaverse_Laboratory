import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import { spacing } from "../../../src/theme/spacing";

const TABS = {
  TOOLS: "TOOLS",
  EVENTS: "EVENTS",
};

const PURPLE = "#2E2B8F";
const MUTED = "#9CA3AF";
const BG = "#FFFFFF";

const demoEventData = [
  {
    id: "e1",
    status: "Coming Soon",
    title: "Building Virtual Worlds with\nUnity & VR",
    sub: "Metaverse Laboratory ITB",
    date: "Monday, 29 December 2025",
    time: "11:00 – 12:00 AM",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "e2",
    status: "Completed",
    title: "The Future of Digital\nInteraction",
    sub: "Hybrid\n(Metaverse Laboratory ITB & Zoom)",
    date: "Sunday, 19 June 2025",
    time: "13:00 – 15:00 PM",
    image:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "e3",
    status: "Canceled",
    title: "Metaverse Project\nShowcase 2025",
    sub: "ITB Convention Hall",
    date: "Saturday, 14 January 2025",
    time: "12:00 – 14:00 PM",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=60",
  },
];

const demoToolData = [
  {
    id: "t1",
    title: "Oculus Quest 2",
    status: "On process",
    date: "23 hours ago",
    image:
      "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "t2",
    title: "Motion Capture Suit",
    status: "Not returned yet",
    date: "20 June 2024",
    image:
      "https://images.unsplash.com/photo-1520975958225-53e41b8b35fc?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "t3",
    title: "Haptic Gloves",
    status: "Returned",
    date: "19 May 2023",
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: "t4",
    title: "3D Scanner",
    status: "Returned",
    date: "19 January 2022",
    image:
      "https://images.unsplash.com/photo-1581091215367-59ab6c6f2b2c?auto=format&fit=crop&w=900&q=60",
  },
];

function TabButton({ active, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text style={[styles.tabText, active ? styles.tabTextActive : styles.tabTextInactive]}>
        {label}
      </Text>
      <View style={[styles.tabUnderline, active ? styles.tabUnderlineActive : styles.tabUnderlineOff]} />
    </Pressable>
  );
}

function StatusPill({ text }) {
  return (
    <View style={styles.statusPill}>
      <Text style={styles.statusPillText}>{text}</Text>
    </View>
  );
}

function EventCard({ item }) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventTopRow}>
        <Image source={{ uri: item.image }} style={styles.eventImg} />
        <View style={{ flex: 1 }}>
          <StatusPill text={item.status} />
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.eventSub} numberOfLines={2}>
            {item.sub}
          </Text>
        </View>
      </View>

      <View style={styles.eventInfoRow}>
        <View style={styles.eventInfoItem}>
          <Ionicons name="calendar-outline" size={18} color="#8B5CF6" />
          <Text style={styles.eventInfoText} numberOfLines={1}>
            {item.date}
          </Text>
        </View>

        <View style={styles.eventInfoItem}>
          <Ionicons name="time-outline" size={18} color="#8B5CF6" />
          <Text style={styles.eventInfoText} numberOfLines={1}>
            {item.time}
          </Text>
        </View>
      </View>
    </View>
  );
}

function ToolCard({ item }) {
  return (
    <View style={styles.toolCard}>
      <Image source={{ uri: item.image }} style={styles.toolImg} />

      <View style={{ flex: 1 }}>
        <Text style={styles.toolTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.toolStatus} numberOfLines={1}>
          {item.status}
        </Text>
        <Text style={styles.toolDate} numberOfLines={1}>
          {item.date}
        </Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState(TABS.EVENTS);

  const data = useMemo(() => {
    return tab === TABS.EVENTS ? demoEventData : demoToolData;
  }, [tab]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TabButton
          label="Tool’s Booking"
          active={tab === TABS.TOOLS}
          onPress={() => setTab(TABS.TOOLS)}
        />
        <TabButton
          label="Event Registration"
          active={tab === TABS.EVENTS}
          onPress={() => setTab(TABS.EVENTS)}
        />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          tab === TABS.EVENTS ? <EventCard item={item} /> : <ToolCard item={item} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: { fontSize: 30, fontWeight: "900", color: "#111827" },

  tabsRow: {
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    gap: 22,
    marginTop: 8,
    marginBottom: 12,
  },
  tabBtn: { paddingVertical: 10 },
  tabText: { fontSize: 22, fontWeight: "900" },
  tabTextActive: { color: PURPLE },
  tabTextInactive: { color: "#CBD5E1" },
  tabUnderline: {
    height: 3,
    borderRadius: 3,
    marginTop: 10,
  },
  tabUnderlineActive: { backgroundColor: PURPLE, width: "100%" },
  tabUnderlineOff: { backgroundColor: "transparent", width: "100%" },

  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 24,
    paddingTop: 6,
  },

  /* Event card */
  eventCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  eventTopRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  eventImg: { width: 118, height: 80, borderRadius: 18, backgroundColor: "#E5E7EB" },

  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: PURPLE,
    marginBottom: 10,
  },
  statusPillText: { color: PURPLE, fontSize: 14, fontWeight: "900" },

  eventTitle: { fontSize: 20, fontWeight: "900", color: "#111827", lineHeight: 24 },
  eventSub: { marginTop: 6, fontSize: 14, fontWeight: "700", color: "#9CA3AF", lineHeight: 18 },

  eventInfoRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  eventInfoItem: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1, minWidth: 0 },
  eventInfoText: { fontSize: 14, fontWeight: "800", color: "#111827", flexShrink: 1 },

  /* Tool card */
  toolCard: {
    borderWidth: 2,
    borderColor: "rgba(148,163,184,0.8)",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  toolImg: { width: 86, height: 66, borderRadius: 14, backgroundColor: "#E5E7EB" },
  toolTitle: { fontSize: 22, fontWeight: "900", color: "#111827" },
  toolStatus: { marginTop: 6, fontSize: 18, fontWeight: "700", color: "#CBD5E1" },
  toolDate: { marginTop: 6, fontSize: 16, fontWeight: "800", color: PURPLE },
});
