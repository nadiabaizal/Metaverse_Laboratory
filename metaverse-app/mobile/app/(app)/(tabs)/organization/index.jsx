import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";
import { supabase } from "../../../../src/lib/supabase";

const FILTERS = ["All", "Core", "Developer", "Research", "Coordinator"];

/* ================= CARD ================= */
function MemberCard({ item, onPress, onLongPress, openLink, openPhone, openEmail}) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.cardOuter,
        pressed && {
          transform: [{ scale: Platform.OS === "ios" ? 0.99 : 0.995 }],
          opacity: 0.98,
        },
      ]}
    >
      <View style={styles.card}>
        <Image source={item.image} style={styles.avatar} />

        <View style={styles.info}>
          <View style={styles.rowTop}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>

            {!!item.category && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            )}
          </View>

          <Text style={styles.role} numberOfLines={1}>
            {item.role}
          </Text>

          <View style={styles.actions}>
            <IconAction icon="call-outline" onPress={() => openPhone(item.phone)} />
            <IconAction icon="mail-outline" onPress={() => openEmail(item.email)} />
            <IconAction icon="logo-instagram" onPress={() => openLink(item.instagram)} />
            <IconAction icon="logo-linkedin" onPress={() => openLink(item.linkedin)} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function IconAction({ icon, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.75 }]}>
      <Ionicons name={icon} size={18} color={colors.primary} />
    </Pressable>
  );
}

/* ================= SCREEN ================= */
export default function OrganizationScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [members, setMembers] = useState([]);

  /* ===== FETCH SUPABASE ===== */
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("organization_members")
        .select("id, name, job_title, role, image_url, phone, email, instagram, linkedin");

      if (error) {
        console.error("SUPABASE ERROR:", error);
        return;
      }

      setMembers(
        (data ?? []).map((m) => ({
          id: m.id,
          name: m.name ?? "",
          role: m.job_title ?? "",
          category: (m.role ?? "").trim(), // ⬅️ PENTING
          image: m.image_url ? { uri: m.image_url } : null,
          phone: m.phone ?? null,
          email: m.email ?? null,
          instagram: m.instagram ?? null,
          linkedin: m.linkedin ?? null,
        }))
      );
    };

    fetchMembers();
  }, []);

  /* ===== FILTER + SEARCH (FIX TOTAL) ===== */
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();

    return members.filter((m) => {
      const role = (m.category || "").toLowerCase();
      const filter = activeFilter.toLowerCase();

      const matchFilter =
        filter === "all" ||
        role === filter ||
        (filter === "research" && role === "researcher");

      if (!matchFilter) return false;
      if (!q) return true;

      return `${m.name} ${m.role} ${m.category}`.toLowerCase().includes(q);
    });
  }, [members, query, activeFilter]);

  const openLink = async (url) => {
    if (!url) {
      Alert.alert("Info", "Kontak belum tersedia.");
      return;
    }
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Failed", "Unable to open the link.");
    }
  };

    const openPhone = (phone) => {
      if (!phone) {
        Alert.alert("Info", "Nomor telepon belum tersedia.");
        return;
      }
      Linking.openURL(`tel:${phone}`);
    };

    const openEmail = (email) => {
      if (!email) {
        Alert.alert("Info", "Email belum tersedia.");
        return;
      }
      Linking.openURL(`mailto:${email}`);
    };


  const onLongPressCard = (m) => {
    Alert.alert(m.name, "Quick Contact", [
      { text: "Call", onPress: () => openPhone(m.phone) },
      { text: "Email", onPress: () => openEmail(m.email) },
      { text: "Instagram", onPress: () => openLink(m.instagram) },
      { text: "LinkedIn", onPress: () => openLink(m.linkedin) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  /* ================= UI (AS IS) ================= */
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Organization</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Member..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.chip, f === activeFilter && styles.chipActive]}
            >
              <Text style={[styles.chipText, f === activeFilter && styles.chipTextActive]}>
                {f}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lab Members</Text>
        <Text style={styles.sectionCount}>{data.length} people</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.l }} />}
        renderItem={({ item }) => (
          <MemberCard
            item={item}
            openLink={openLink}
            openPhone={openPhone}
            openEmail={openEmail}
            onPress={() =>
              router.push({ pathname: "/(app)/organization/[id]", params: { id: item.id } })
            }
            onLongPress={() => onLongPressCard(item)}
          />
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "800" }}>No members found</Text>
            <Text style={{ marginTop: 6, color: "#6B7280" }}>
              Try a different keyword or filter.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ================= STYLES (UNCHANGED) ================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 26, fontWeight: "800", color: "#111827" },
  searchWrap: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.m,
    padding: spacing.l,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  searchInput: { flex: 1, fontSize: 16 },
  chipsWrap: { marginHorizontal: spacing.xl, marginBottom: spacing.l },
  chip: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: 999,
    backgroundColor: "#F4F4F6",
    borderWidth: 1,
    borderColor: "#ECECF0",
    marginRight: spacing.m,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: "700", color: "#9CA3AF" },
  chipTextActive: { color: "#fff" },
  sectionHeader: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.l,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  sectionCount: { fontSize: 12, color: "#9CA3AF" },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  cardOuter: { borderRadius: 22, elevation: 3 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: colors.primary,
    padding: spacing.l,
    gap: spacing.l,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
  },
  info: { flex: 1 },
  rowTop: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontSize: 16, fontWeight: "800" },
  role: { marginTop: 6, fontSize: 13, color: "#9CA3AF" },
  badge: {
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EEE9FF",
  },
  badgeText: { fontSize: 11, fontWeight: "800", color: colors.primary },
  actions: { marginTop: spacing.l, flexDirection: "row", gap: spacing.m },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F4F2FF",
    alignItems: "center",
    justifyContent: "center",
  },
});
