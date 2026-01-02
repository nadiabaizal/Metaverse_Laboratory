import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";
import { supabase } from "../../../../src/lib/supabase";

const { width } = Dimensions.get("window");

/* ===================== DOTS ===================== */
function Dots({ count, active }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
      ))}
    </View>
  );
}

/* ===================== SCREEN ===================== */
export default function ProjectDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ===================== FETCH DETAIL ===================== */
  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          id,
          title,
          subtitle,
          description,
          external_url,
          information,
          project_images (
            image_url,
            order_index
          )
        `)
        .eq("id", id)
        .single();

      if (error || !data) {
        console.log("SUPABASE ERROR:", error);
        setLoading(false);
        return;
      }

      const images = (data.project_images || [])
        .sort((a, b) => a.order_index - b.order_index)
        .map((img) => {
          // ✅ JIKA SUDAH FULL URL
          if (img.image_url.startsWith("http")) {
            return img.image_url;
          }

          // ✅ JIKA MASIH PATH STORAGE
          const { data: publicData } = supabase
            .storage
            .from("projects") // ⚠️ NAMA BUCKET
            .getPublicUrl(img.image_url);

          return publicData.publicUrl;
        });

      console.log("FINAL IMAGE URLS:", images); // 🔥 DEBUG WAJIB

      setProject({
        ...data,
        images,
        info: data.information,
      });

      setLoading(false);
    };

    if (id) fetchProject();
  }, [id]);

  /* ===================== LOADING / EMPTY ===================== */
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: spacing.xl }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ padding: spacing.xl }}>Project not found</Text>
      </SafeAreaView>
    );
  }

  /* ===================== HELPERS ===================== */
  const openExternal = async () => {
    if (!project.external_url) return;
    const can = await Linking.canOpenURL(project.external_url);
    if (can) await Linking.openURL(project.external_url);
  };

  /* ===================== UI ===================== */
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* SLIDER */}
        <FlatList
          data={project.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${item}-${index}`}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / width
            );
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={styles.sliderItem}>
              <Image
                source={{ uri: item }}  
                style={styles.sliderImage} 
              />
            </View>
          )}
        />

        <Dots count={project.images.length} active={activeIndex} />

        {/* TITLE */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.subtitle}>{project.subtitle}</Text>

          {!!project.external_url && (
            <TouchableOpacity onPress={openExternal} style={styles.openPill}>
              <Ionicons name="open-outline" size={16} color={colors.primary} />
              <Text style={styles.openPillText}>Open in Spatial</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* DESCRIPTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.body}>{project.description}</Text>
        </View>

        {/* INFORMATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          <View style={styles.infoCard}>
            <InfoRow label="Platform" value={project.info?.platform} />
            <InfoRow label="Location" value={project.info?.location} />
            <InfoRow label="Type" value={project.info?.type} />
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===================== INFO ROW ===================== */
function InfoRow({ label, value }) {
  return (
    <>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || "-"}</Text>
      </View>
      <View style={styles.infoDivider} />
    </>
  );
}

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.m,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
  },

  content: {
    paddingBottom: spacing.xxl,
  },

  sliderItem: {
    width: width,
    alignItems: "center",
  },
  sliderImage: {
    width: width,
    aspectRatio: 16 / 9,
    resizeMode: "contain",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginVertical: spacing.l,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    backgroundColor: "#3B82F6",
  },

  titleBlock: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: spacing.s,
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "700",
  },

  openPill: {
    marginTop: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.l,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(156,134,255,0.14)",
  },
  openPillText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.primary,
  },

  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: spacing.m,
  },
  body: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },

  infoCard: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: spacing.xl,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "900",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: spacing.l,
  },
});
