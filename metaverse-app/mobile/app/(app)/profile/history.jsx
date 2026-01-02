import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../../src/lib/supabase";
import { spacing } from "../../../src/theme/spacing";

const TABS = {
  TOOLS: "TOOLS",
  EVENTS: "EVENTS",
};

const PURPLE = "#2E2B8F";
const BG = "#FFFFFF";

export default function HistoryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState(TABS.EVENTS);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    /* ================= EVENTS ================= */
    const { data: eventData } = await supabase
      .from("event_registrations")
      .select(`
        id,
        status,
        events (
          title,
          location,
          event_date,
          event_start_time,
          event_end_time,
          cover_image
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setEvents(
      (eventData ?? []).map((e) => ({
        id: e.id,
        status: e.status ?? "Coming Soon",
        title: e.events?.title ?? "-",
        sub: e.events?.location ?? "-",
        date: e.events?.event_date
          ? formatDate(e.events.event_date)
          : "-",
        time:
          e.events?.event_start_time && e.events?.event_end_time
            ? `${e.events.event_start_time} – ${e.events.event_end_time}`
            : "-",
        image: e.events?.cover_image,
      }))
    );

    /* ================= TOOLS ================= */
    const { data: toolData } = await supabase
      .from("facility_bookings")
      .select("id, facility_name, facility_image, status, borrowed_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setTools(
      (toolData ?? []).map((t) => ({
        id: t.id,
        title: t.facility_name ?? "Unknown Tool",
        status: t.status,
        date: formatRelative(t.borrowed_at),
        image: t.facility_image,
      }))
    );

    setLoading(false);
  }

  const data = useMemo(
    () => (tab === TABS.EVENTS ? events : tools),
    [tab, events, tools]
  );
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
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

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color={PURPLE} style={{ marginTop: 40 }} />
      ) : data.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(it) => it.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) =>
            tab === TABS.EVENTS ? <EventCard item={item} /> : <ToolCard item={item} />
          }
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

function TabButton({ active, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text style={[styles.tabText, active ? styles.tabTextActive : styles.tabTextInactive]}>
        {label}
      </Text>
      <View style={[styles.tabUnderline, active && styles.tabUnderlineActive]} />
    </Pressable>
  );
}

function EmptyState({ tab }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="time-outline" size={48} color="#CBD5E1" />
      <Text style={styles.emptyText}>
        {tab === TABS.EVENTS
          ? "Belum ada event yang kamu ikuti"
          : "Belum ada riwayat peminjaman alat"}
      </Text>
    </View>
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
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventSub}>{item.sub}</Text>
        </View>
      </View>

      <View style={styles.eventInfoRow}>
        <Info icon="calendar-outline" text={item.date} />
        <Info icon="time-outline" text={item.time} />
      </View>
    </View>
  );
}

function ToolCard({ item }) {
  return (
    <View style={styles.toolCard}>
      <Image source={{ uri: item.image }} style={styles.toolImg} />
      <View style={{ flex: 1 }}>
        <Text style={styles.toolTitle}>{item.title}</Text>
        <Text style={styles.toolStatus}>{item.status}</Text>
        <Text style={styles.toolDate}>{item.date}</Text>
      </View>
    </View>
  );
}

function Info({ icon, text }) {
  return (
    <View style={styles.eventInfoItem}>
      <Ionicons name={icon} size={18} color="#8B5CF6" />
      <Text style={styles.eventInfoText}>{text}</Text>
    </View>
  );
}

/* ================= HELPERS ================= */

function formatDate(date) {
  return new Date(date).toDateString();
}

function formatRelative(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 3600000);
  return diff < 24 ? `${diff} hours ago` : new Date(date).toDateString();
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 30, fontWeight: "900", color: "#111827" },

  tabsRow: { paddingHorizontal: spacing.xl, flexDirection: "row", gap: 22 },
  tabBtn: { paddingVertical: 10 },
  tabText: { fontSize: 22, fontWeight: "900" },
  tabTextActive: { color: PURPLE },
  tabTextInactive: { color: "#CBD5E1" },
  tabUnderline: { height: 3, marginTop: 8 },
  tabUnderlineActive: { backgroundColor: PURPLE },

  list: { paddingHorizontal: spacing.xl, paddingBottom: 24 },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  eventCard: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 14,
    elevation: 3,
  },
  eventTopRow: { flexDirection: "row", gap: 12 },
  eventImg: { width: 118, height: 80, borderRadius: 18 },

  statusPill: {
    borderColor: PURPLE,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  statusPillText: { color: PURPLE, fontWeight: "900" },

  eventTitle: { fontSize: 20, fontWeight: "900" },
  eventSub: { color: "#9CA3AF", marginTop: 4 },

  eventInfoRow: { flexDirection: "row", marginTop: 12, gap: 16 },
  eventInfoItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  eventInfoText: { fontWeight: "800" },

  toolCard: {
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 22,
    padding: 14,
    flexDirection: "row",
    gap: 14,
  },
  toolImg: { width: 86, height: 66, borderRadius: 14 },
  toolTitle: { fontSize: 22, fontWeight: "900" },
  toolStatus: { color: "#CBD5E1", marginTop: 4 },
  toolDate: { color: PURPLE, marginTop: 4, fontWeight: "800" },
});
