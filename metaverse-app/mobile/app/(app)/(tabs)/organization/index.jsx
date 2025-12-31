import React, { useMemo, useState } from "react";
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
import { organizationMembers } from "../../../../src/data/mockOrganization";

const FILTERS = ["All", "Core", "Developer", "Research", "Coordinator"];

function MemberCard({ item, onPress, onLongPress, openLink }) {
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
            <IconAction icon="call-outline" onPress={() => openLink(item.phone)} />
            <IconAction icon="mail-outline" onPress={() => openLink(item.email)} />
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

export default function OrganizationScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();

    return organizationMembers
      .filter((m) => (activeFilter === "All" ? true : m.category === activeFilter))
      .filter((m) => {
        if (!q) return true;
        const hay = `${m.name || ""} ${m.role || ""} ${m.category || ""}`.toLowerCase();
        return hay.includes(q);
      });
  }, [query, activeFilter]);

  const openLink = async (url) => {
    if (!url) {
      Alert.alert("Info", "Kontak belum tersedia.");
      return;
    }
    try {
      const ok = await Linking.canOpenURL(url);
      if (!ok) return Alert.alert("Cannot open link", "Link tidak didukung di device ini.");
      await Linking.openURL(url);
    } catch {
      Alert.alert("Failed", "Unable to open the link.");
    }
  };

  const onLongPressCard = (m) => {
    Alert.alert(m.name, "Quick Contact", [
      { text: "Call", onPress: () => openLink(m.phone) },
      { text: "Email", onPress: () => openLink(m.email) },
      { text: "Instagram", onPress: () => openLink(m.instagram) },
      { text: "LinkedIn", onPress: () => openLink(m.linkedin) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER (STANDARD - sama dengan Project) */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Organization</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* SEARCH (SAMA PERSIS DENGAN PROJECT) - STAY */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Member..."
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

      {/* FILTER CHIPS (STAY) - gaya rapi, posisi mengikuti Project layout */}
      <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <Pressable
                key={f}
                onPress={() => setActiveFilter(f)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* SECTION HEADER (STAY) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lab Members</Text>
        <Text style={styles.sectionCount}>{data.length} people</Text>
      </View>

      {/* LIST (yang scroll hanya list) */}
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.l }} />}
        renderItem={({ item }) => (
          <MemberCard
            item={item}
            openLink={openLink}
            onPress={() => router.push({ pathname: "/(app)/organization/[id]", params: { id: item.id } })}
            onLongPress={() => onLongPressCard(item)}
          />
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>No members found</Text>
            <Text style={{ marginTop: 6, color: "#6B7280" }}>Try a different keyword or filter.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  // STANDARD HEADER (SAMA DENGAN PROJECT)
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

  // ✅ SEARCH (SAMA PERSIS DENGAN PROJECT)
  searchWrap: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.m,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },

  // Chips stay (posisi mengikuti layout project: sejajar marginHorizontal xl)
  chipsWrap: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.l,
  },
  chipsRow: {
    gap: spacing.m,
  },
  chip: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderRadius: 999,
    backgroundColor: "#F4F4F6",
    borderWidth: 1,
    borderColor: "#ECECF0",
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: "700", color: "#9CA3AF" },
  chipTextActive: { color: "#fff" },

  sectionHeader: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.l,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  sectionCount: { fontSize: 12, color: "#9CA3AF", fontWeight: "600" },

  // list content mengikuti project (paddingHorizontal xl)
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  // card member
  cardOuter: {
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
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
  info: { flex: 1, justifyContent: "center" },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.m,
  },
  name: { flex: 1, fontSize: 16, fontWeight: "800", color: "#111827" },
  role: { marginTop: 6, fontSize: 13, color: "#9CA3AF", fontWeight: "600" },

  badge: {
    paddingHorizontal: spacing.m,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EEE9FF",
    borderWidth: 1,
    borderColor: "#DED4FF",
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
    borderWidth: 1,
    borderColor: "#E7E1FF",
  },
});
