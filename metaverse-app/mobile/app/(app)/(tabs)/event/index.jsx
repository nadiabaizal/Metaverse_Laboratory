import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";

import { MOCK_EVENTS } from "../../../../src/data/mockEvents";

const FILTERS = [
  { key: "available", label: "Available" },
  { key: "latest", label: "Latest Added" },
  { key: "oldest", label: "Oldest Added" },
];

export default function EventScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("available");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = MOCK_EVENTS.filter((e) => {
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.org.toLowerCase().includes(q) ||
        e.dateLabel.toLowerCase().includes(q)
      );
    });

    if (activeFilter === "available") {
      list = list.slice().sort((a, b) => (b.seatsLeft ?? 0) - (a.seatsLeft ?? 0));
    } else if (activeFilter === "latest") {
      list = list.slice().reverse();
    } else if (activeFilter === "oldest") {
      list = list.slice();
    }
    return list;
  }, [query, activeFilter]);

  const openDetails = (item) => {
    router.push({ pathname: "/(app)/event/[id]", params: { id: item.id } });
  };

  const openRegister = (item) => {
    router.push({ pathname: "/(app)/event/[id]/register", params: { id: item.id } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Event..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.filterIcon} hitSlop={10}>
            <Ionicons name="options-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.segmentOuter}>
        <View style={styles.segment}>
          {FILTERS.map((f) => {
            const active = f.key === activeFilter;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[styles.segItem, active && styles.segItemActive]}
                activeOpacity={0.9}
              >
                <Text style={[styles.segText, active && styles.segTextActive]} numberOfLines={1}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.l, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.images?.[0] }} style={styles.cardImg} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardOrg}>{item.org}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaLeft}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                    <Text style={styles.metaText}>{item.dateLabel}</Text>
                  </View>
                  <View style={[styles.metaItem, { marginTop: 10 }]}>
                    <Ionicons name="time-outline" size={18} color={colors.primary} />
                    <Text style={styles.metaText}>{item.timeLabel}</Text>
                  </View>
                </View>

                <View style={styles.seatPill}>
                  <View style={styles.seatDot} />
                  <Text style={styles.seatText}>{item.seatsLeft} seats left</Text>
                </View>
              </View>

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btnOutline} onPress={() => openDetails(item)} activeOpacity={0.9}>
                  <Text style={styles.btnOutlineText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => openRegister(item)} activeOpacity={0.9}>
                  <Text style={styles.btnPrimaryText}>Register Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>No events found</Text>
            <Text style={{ marginTop: 6, color: "#6B7280" }}>Try a different keyword.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingTop: spacing.m,
    paddingHorizontal: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#111827" },

  searchWrap: { paddingHorizontal: spacing.l, paddingTop: spacing.l },
  searchBox: {
    height: 54,
    borderRadius: 16,
    paddingHorizontal: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: "#111827" },
  filterIcon: { paddingLeft: 10 },

  segmentOuter: { paddingHorizontal: spacing.l, paddingTop: spacing.l },
  segment: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    padding: 6,
    gap: 6,
  },
  segItem: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  segItemActive: {
    backgroundColor: "#2D2A7B",
  },
  segText: { fontSize: 14, fontWeight: "800", color: "#9CA3AF" },
  segTextActive: { color: "#FFFFFF" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    marginBottom: spacing.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  cardImg: { width: "100%", height: 170, borderTopLeftRadius: 22, borderTopRightRadius: 22 },
  cardBody: { padding: spacing.l },
  cardTitle: { fontSize: 26, fontWeight: "900", color: "#0F172A" },
  cardOrg: { marginTop: 6, fontSize: 16, fontWeight: "700", color: "#111827", opacity: 0.75 },

  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.l, gap: spacing.m },
  metaLeft: { flex: 1 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaText: { fontSize: 16, fontWeight: "700", color: "#111827", flexShrink: 1 },

  seatPill: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(156,134,255,0.22)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  seatDot: { width: 10, height: 10, borderRadius: 10, backgroundColor: "#2D2A7B" },
  seatText: { fontSize: 16, fontWeight: "900", color: "#2D2A7B" },

  btnRow: { flexDirection: "row", gap: spacing.m, marginTop: spacing.xl },
  btnOutline: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2D2A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutlineText: { fontSize: 18, fontWeight: "900", color: "#2D2A7B" },
  btnPrimary: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#2D2A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: { fontSize: 18, fontWeight: "900", color: "#FFFFFF" },
});
