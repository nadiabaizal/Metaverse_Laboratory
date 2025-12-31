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

import { spacing } from "../../../../src/theme/spacing";
import { MOCK_FACILITIES } from "../../../../src/data/mockFacilities";

const FILTERS = [
  { key: "available", label: "Available" },
  { key: "latest", label: "Latest Added" },
  { key: "oldest", label: "Oldest Added" },
];

export default function FacilityScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("available");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = MOCK_FACILITIES.filter((t) => {
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q)
      );
    });

    if (activeFilter === "available") {
      list = list.slice().sort((a, b) => (b.available ?? 0) - (a.available ?? 0));
    } else if (activeFilter === "latest") {
      list = list
        .slice()
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } else if (activeFilter === "oldest") {
      list = list
        .slice()
        .sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }

    return list;
  }, [query, activeFilter]);

  const openDetails = (item) => {
    router.push({ pathname: "/(app)/facility/[id]", params: { id: item.id } });
  };

  const openBooking = (item) => {
    router.push({ pathname: "/(app)/facility/[id]/booking", params: { id: item.id } });
  };

  return (
    <View style={styles.screen}>
      {/* SafeArea hanya untuk header (biar konsisten dgn Event) */}
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>

          <Text style={styles.headerTitle}>Facility</Text>

          {/* spacer agar title center */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Konten di luar SafeArea */}
      <View style={styles.content}>
        {/* ✅ SEARCH (posisi & style DISAMAKAN dengan Event) */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search Tools..."
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

        {/* ✅ SEGMENT FILTER (di bawah search, sama dgn Event) */}
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
            paddingHorizontal: spacing.xl, // konsisten sama Event
            paddingTop: spacing.l,
            paddingBottom: 120,
          }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.images?.[0] }} style={styles.thumb} />

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.shortDescription}
                </Text>

                <Text style={styles.leftText}>{item.available} more left</Text>

                <View style={styles.btnRow}>
                  <Pressable style={styles.btnOutline} onPress={() => openDetails(item)}>
                    <Text style={styles.btnOutlineText}>Details</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.btnPrimary, item.available <= 0 && styles.btnDisabled]}
                    onPress={() => openBooking(item)}
                    disabled={item.available <= 0}
                  >
                    <Text style={styles.btnPrimaryText}>Book Now</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
                No tools found
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

  // ✅ STANDARD HEADER (sama style struktur Event)
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

  // ✅ SEARCH (disamain persis dengan Event)
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

  // ✅ SEGMENT (disamain persis dengan Event)
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
    padding: spacing.l,
    flexDirection: "row",
    gap: spacing.l,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  thumb: { width: 92, height: 92, borderRadius: 18, backgroundColor: "#E5E7EB" },

  cardBody: { flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: "900", color: "#111827" },
  cardDesc: { marginTop: 6, color: "#6B7280", fontWeight: "700", lineHeight: 18 },
  leftText: { marginTop: 10, fontWeight: "900", color: "#111827" },

  btnRow: { flexDirection: "row", gap: spacing.m, marginTop: spacing.l },
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
  btnDisabled: { opacity: 0.55 },
  btnPrimaryText: { fontSize: 16, fontWeight: "900", color: "#FFFFFF" },
});
