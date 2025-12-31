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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";
import { mockProjects } from "../../../../src/data/mockProjects";

function FeaturedCard({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.featuredWrap}>
      <View style={styles.featuredCard}>
        <Image source={{ uri: item.images?.[0] }} style={styles.featuredImage} />
        <View style={styles.featuredBody}>
          <Text style={styles.featuredLabel}>{item.label}</Text>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.featuredDesc} numberOfLines={2}>
            {item.short}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function CompactCard({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.compactWrap}>
      <View style={styles.compactCard}>
        <View style={styles.compactLeft}>
          <Text style={styles.compactLabel}>{item.label}</Text>
          <Text style={styles.compactTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.compactDesc} numberOfLines={2}>
            {item.short}
          </Text>
        </View>
        <Image source={{ uri: item.images?.[0] }} style={styles.compactThumb} />
      </View>
    </Pressable>
  );
}

export default function ProjectScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockProjects;
    return mockProjects.filter((p) => {
      const hay = `${p.title} ${p.subtitle} ${p.label} ${p.short}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const featured = data[0];
  const rest = data.slice(1);

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER (STANDARD - SAMA DENGAN EVENT/ORGANIZATION) */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Project</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* SEARCH */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search Project..."
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

      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          featured ? (
            <FeaturedCard
              item={featured}
              onPress={() => router.push({ pathname: "/project/[id]", params: { id: featured.id } })}
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CompactCard
            item={item}
            onPress={() => router.push({ pathname: "/project/[id]", params: { id: item.id } })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.l }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  // STANDARD HEADER (SAMA DENGAN EVENT & ORGANIZATION)
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

  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  featuredWrap: { marginBottom: spacing.xl },
  featuredCard: {
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    overflow: "hidden",
  },
  featuredImage: { width: "100%", height: 170 },
  featuredBody: {
    padding: spacing.xl,
    paddingTop: spacing.l,
  },
  featuredLabel: {
    color: colors.primary,
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 13,
    marginBottom: spacing.s,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginBottom: spacing.s,
  },
  featuredDesc: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  compactCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: spacing.xl,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
  },
  compactLeft: { flex: 1 },
  compactLabel: {
    color: colors.primary,
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 13,
    marginBottom: spacing.s,
  },
  compactTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginBottom: spacing.s,
  },
  compactDesc: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  compactThumb: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
  },
});
