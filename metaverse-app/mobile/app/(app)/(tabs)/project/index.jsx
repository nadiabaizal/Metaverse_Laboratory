import React, { useMemo, useState, useEffect } from "react";
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
import { supabase } from "../../../../src/lib/supabase";

/* ===================== CARD COMPONENT ===================== */

function FeaturedCard({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.featuredWrap}>
      <View style={styles.featuredCard}>
        <Image
          source={{ uri: item.cover_image }}
          style={styles.featuredImage}
        />
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
    <Pressable onPress={onPress}>
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
        <Image
          source={{ uri: item.cover_image }}
          style={styles.compactThumb}
        />
      </View>
    </Pressable>
  );
}

/* ===================== SCREEN ===================== */

export default function ProjectScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState([]);

  /* ===================== FETCH SUPABASE ===================== */
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          title,
          subtitle,
          label,
          short,
          cover_image
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("SUPABASE ERROR:", error);
        return;
      }

      const mapped = (data || []).map((p) => ({
        ...p,
        cover_image:
          p.cover_image ||
          "https://via.placeholder.com/600x400?text=No+Cover",
      }));

      setProjects(mapped);
    };

    fetchProjects();
  }, []);

  /* ===================== SEARCH FILTER ===================== */
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((p) => {
      const hay = `${p.title} ${p.subtitle} ${p.label} ${p.short}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, projects]);

  const featured = data[0];
  const rest = data.slice(1);

  /* ===================== UI ===================== */
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
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
              onPress={() =>
                router.push({
                  pathname: "/project/[id]",
                  params: { id: featured.id },
                })
              }
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CompactCard
            item={item}
            onPress={() =>
              router.push({
                pathname: "/project/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.l }} />}
      />
    </SafeAreaView>
  );
}

/* ===================== STYLES (TIDAK DIUBAH) ===================== */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    overflow: "hidden",
    elevation: 4,
  },
  featuredImage: { width: "100%", height: 170 },
  featuredBody: { padding: spacing.xl },
  featuredLabel: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 13,
    marginBottom: spacing.s,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  featuredDesc: {
    fontSize: 14,
    color: "#374151",
  },

  compactCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
  },
  compactLeft: { flex: 1 },
  compactLabel: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 13,
  },
  compactTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  compactDesc: {
    fontSize: 14,
    color: "#374151",
  },
  compactThumb: {
    width: 88,
    height: 88,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
  },
});
