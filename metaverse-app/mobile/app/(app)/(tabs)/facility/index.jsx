import React, { useMemo, useState, useEffect } from "react";
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
import { supabase } from "../../../../src/lib/supabase";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";


const FILTERS = [
  { key: "available", label: "Available" },
  { key: "latest", label: "Latest" },
  { key: "oldest", label: "Oldest" },
];

export default function FacilityScreen() {
  const router = useRouter();

  const [facilities, setFacilities] = useState([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("available");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH + FIX IMAGE URL ================= */
  const loadFacilities = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("facilities")
      .select(`
        id,
        name,
        description,
        how_to_use,
        cover_image,
        stock,
        is_available,
        facility_added_date
      `);

    if (error) {
      console.error("LOAD FACILITIES ERROR:", error);
    }

    if (!error && data) {
      const mapped = data.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description,
        howToUse: f.how_to_use,
        images: [f.cover_image], 
        stock: f.stock,
        isAvailable: f.is_available,
        facility_added_date: f.facility_added_date,
      }));

      setFacilities(mapped);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadFacilities();
    }, [])
  );

  /* ================= FILTER + SEARCH ================= */
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = facilities.filter((f) => {
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    });

    if (activeFilter === "available") {
      list = list.filter((f) => f.stock > 0);
    }

    if (activeFilter === "latest") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.facility_added_date) -
          new Date(a.facility_added_date)
      );
    }

    if (activeFilter === "oldest") {
      list = [...list].sort(
        (a, b) =>
          new Date(a.facility_added_date) -
          new Date(b.facility_added_date)
      );
    }

    return list;
  }, [facilities, query, activeFilter]);

  const openDetails = (item) => {
    router.push({
      pathname: "/(app)/facility/[id]",
      params: { id: item.id },
    });
  };

  const openBooking = (item) => {
    router.push({
      pathname: "/(app)/facility/[id]/booking",
      params: { id: item.id },
    });
  };

  /* ================= UI (AS IS) ================= */
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>

          <Text style={styles.headerTitle}>Facility</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        {/* SEARCH */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search Tools..."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* FILTER */}
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
                  <Text style={[styles.segText, active && styles.segTextActive]}>
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
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.l,
            paddingBottom: 120,
          }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.images?.[0] }}
                style={styles.thumb}
              />

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}
                </Text>

                <Text
                  style={[
                    styles.leftText,
                    item.stock === 0 && { color: "#EF4444" },
                  ]}
                >
                  {item.stock > 0 ? `${item.stock} more left` : "Fully Booked"}
                </Text>

                <View style={styles.btnRow}>
                  <Pressable style={styles.btnOutline} onPress={() => openDetails(item)}>
                    <Text style={styles.btnOutlineText}>Details</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.btnPrimary,
                      item.stock === 0 && styles.btnDisabled,
                    ]}
                    onPress={() => openBooking(item)}
                    disabled={item.stock === 0}
                  >
                    <Text style={styles.btnPrimaryText}>Book Now</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

/* ================= STYLES (UNCHANGED) ================= */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  safe: { backgroundColor: "#FFFFFF" },
  content: { flex: 1 },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40 },
  headerTitle: { fontSize: 26, fontWeight: "800" },
  searchWrap: { paddingHorizontal: spacing.xl },
  searchBox: {
    height: 54,
    borderRadius: 16,
    paddingHorizontal: spacing.l,
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  searchInput: { flex: 1 },
  segmentOuter: { paddingHorizontal: spacing.xl, paddingTop: spacing.l },
  segment: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    padding: 6,
  },
  segItem: { flex: 1, height: 44, alignItems: "center", justifyContent: "center" },
  segItemActive: { backgroundColor: "#2D2A7B", borderRadius: 24 },
  segText: { fontWeight: "800", color: "#9CA3AF" },
  segTextActive: { color: "#FFFFFF" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: spacing.l,
    flexDirection: "row",
    gap: spacing.l,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    marginBottom: spacing.xl,
  },
  thumb: { width: 92, height: 92, borderRadius: 18 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: "900" },
  cardDesc: { marginTop: 6, color: "#6B7280", fontWeight: "700" },
  leftText: { marginTop: 10, fontWeight: "900" },
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
  btnOutlineText: { fontWeight: "900", color: "#2D2A7B" },
  btnPrimary: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#2D2A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.55 },
  btnPrimaryText: { fontWeight: "900", color: "#FFFFFF" },
});
