import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
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
    <View style={styles.screen}>
      {/* SafeArea hanya untuk header (biar sama dengan Organization & Project) */}
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>

          <Text style={styles.headerTitle}>Event</Text>

          {/* spacer agar title center */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Konten di luar SafeArea */}
      <View style={styles.content}>
        {/* SEARCH */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search Event..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")} hitSlop={10}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        {/* SEGMENT FILTER */}
        <View style={styles.segmentOuter}>
          <View style={styles.segment}>
            {FILTERS.map((f) => {
              const active = f.key === activeFilter;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setActiveFilter(f.key)}
                  style={[styles.segItem, active && styles.segItemActive]}
                >
                  <Text style={[styles.segText, active && styles.segTextActive]} numberOfLines={1}>
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* LIST */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.xl, // ⬅️ konsisten sama page lain
            paddingTop: spacing.l,
            paddingBottom: 120,
          }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.images?.[0] }} style={styles.cardImg} />

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.cardOrg} numberOfLines={1}>
                  {item.org}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaLeft}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {item.dateLabel}
                      </Text>
                    </View>

                    <View style={[styles.metaItem, { marginTop: 10 }]}>
                      <Ionicons name="time-outline" size={18} color={colors.primary} />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {item.timeLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.seatPill}>
                    <View style={styles.seatDot} />
                    <Text style={styles.seatText}>{item.seatsLeft} seats left</Text>
                  </View>
                </View>

                <View style={styles.btnRow}>
                  <Pressable style={styles.btnOutline} onPress={() => openDetails(item)}>
                    <Text style={styles.btnOutlineText}>Details</Text>
                  </Pressable>

                  <Pressable style={styles.btnPrimary} onPress={() => openRegister(item)}>
                    <Text style={styles.btnPrimaryText}>Register Now</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
                No events found
              </Text>
              <Text style={{ marginTop: 6, color: "#6B7280" }}>Try a different keyword.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  safe: { backgroundColor: "#FFFFFF" },
  content: { flex: 1, backgroundColor: "#FFFFFF" },

  // ✅ STANDARD HEADER (SAMA DENGAN ORGANIZATION & PROJECT)
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.2,
  },

  // SEARCH
  searchWrap: { paddingHorizontal: spacing.xl },
  searchBox: {
    height: 54,
    borderRadius: 16,
    paddingHorizontal: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    gap: spacing.m,
  },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },

  // SEGMENT
  segmentOuter: { paddingHorizontal: spacing.xl, paddingTop: spacing.l },
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
  segItemActive: { backgroundColor: "#2D2A7B" },
  segText: { fontSize: 14, fontWeight: "800", color: "#9CA3AF" },
  segTextActive: { color: "#FFFFFF" },

  // CARD
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
  cardImg: { width: "100%", height: 170 },
  cardBody: { padding: spacing.l },

  cardTitle: { fontSize: 22, fontWeight: "900", color: "#0F172A" },
  cardOrg: { marginTop: 6, fontSize: 15, fontWeight: "700", color: "#111827", opacity: 0.75 },

  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.l, gap: spacing.m },
  metaLeft: { flex: 1 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaText: { fontSize: 15, fontWeight: "700", color: "#111827", flexShrink: 1 },

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
  seatText: { fontSize: 14, fontWeight: "900", color: "#2D2A7B" },

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
  btnOutlineText: { fontSize: 16, fontWeight: "900", color: "#2D2A7B" },
  btnPrimary: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#2D2A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: { fontSize: 16, fontWeight: "900", color: "#FFFFFF" },
});
