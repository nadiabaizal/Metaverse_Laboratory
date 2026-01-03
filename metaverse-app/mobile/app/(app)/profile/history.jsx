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
  TOOLS: "FACILITY",
  EVENTS: "EVENT",
};

const PURPLE = "#2E2B8F";

const STATUS_LABEL = {
  COMING_SOON: "Coming Soon",
  ONGOING: "Ongoing",
  DONE: "Done",

  BOOKED: "Booked",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

/* ================= HELPERS ================= */
function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export default function HistoryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState(TABS.EVENTS);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const STATUS_LABEL = {
    COMING_SOON: "Coming Soon",
    BOOKED: "Booked",
    RETURNED: "Returned",
    DONE: "Done",
  };

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("HISTORY ERROR:", error);
      setLoading(false);
      return;
    }

    setHistory(
      (data ?? []).map((h) => {
        const desc = safeParse(h.description);
        return {
          id: h.id,
          type: h.type?.toUpperCase(),
          title: desc.title ?? "-",
          location: desc.location ?? "",
          date: desc.date ?? "",
          time: desc.time ?? "",
          status: desc.status ?? "Coming Soon",
          image: desc.image,
        };
      })
    );

    setLoading(false);
  }

  const data = useMemo(
    () => history.filter((h) => h.type === tab),
    [history, tab]
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} />
        </Pressable>
        <Text style={styles.headerTitle}>History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Tab
          label="Tool’s Booking"
          active={tab === TABS.TOOLS}
          onPress={() => setTab(TABS.TOOLS)}
        />
        <Tab
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
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) =>
            item.type === "EVENT" ? (
              <EventCard item={item} />
            ) : (
              <ToolCard item={item} />
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */

function Tab({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
      {active && <View style={styles.tabUnderline} />}
    </Pressable>
  );
}

function EmptyState({ tab }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="time-outline" size={48} color="#CBD5E1" />
      <Text style={styles.emptyText}>
        {tab === "EVENT"
          ? "Belum ada event yang kamu ikuti"
          : "Belum ada riwayat peminjaman alat"}
      </Text>
    </View>
  );
}

function EventCard({ item }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.img} />
      <View style={{ flex: 1 }}>
        <Text style={styles.pill}>
          {STATUS_LABEL[item.status] ?? "Unknown"}
        </Text> 
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.sub}>{item.location}</Text>
        <Text style={styles.meta}>
          {item.date} • {item.time}
        </Text>
      </View>
    </View>
  );
}

function ToolCard({ item }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.imgSmall} />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.status}</Text>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", padding: spacing.xl, alignItems: "center" },
  backBtn: { width: 40 },
  headerTitle: { fontSize: 28, fontWeight: "900" },

  tabsRow: { flexDirection: "row", gap: 20, paddingHorizontal: spacing.xl },
  tabBtn: { paddingVertical: 10 },
  tabText: { fontSize: 20, fontWeight: "900", color: "#CBD5E1" },
  tabTextActive: { color: PURPLE },
  tabUnderline: { height: 3, backgroundColor: PURPLE, marginTop: 6 },

  list: { padding: spacing.xl },
  empty: { alignItems: "center", marginTop: 80 },
  emptyText: { marginTop: 12, fontWeight: "700", color: "#9CA3AF" },

  card: {
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
    flexDirection: "row",
    gap: 14,
  },
  img: { width: 120, height: 80, borderRadius: 18 },
  imgSmall: { width: 80, height: 60, borderRadius: 14 },
  pill: {
    borderWidth: 2,
    borderColor: PURPLE,
    color: PURPLE,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: "flex-start",
    fontWeight: "900",
  },
  title: { fontSize: 20, fontWeight: "900" },
  sub: { color: "#9CA3AF", marginTop: 4 },
  meta: { color: PURPLE, marginTop: 6, fontWeight: "800" },
});
