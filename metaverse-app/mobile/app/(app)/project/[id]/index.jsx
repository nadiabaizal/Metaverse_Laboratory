import React, { useMemo, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";
import { getProjectById } from "../../../../src/data/mockProjects";

const { width } = Dimensions.get("window");

function Dots({ count, active }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
      ))}
    </View>
  );
}

export default function ProjectDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const project = useMemo(() => getProjectById(String(id)), [id]);
  const [activeDot] = useState(1);

  if (!project) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Project</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={{ padding: spacing.xl }}>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>Project not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const images = project.images || [];
  const collage = images.slice(0, 4);

  const openExternal = async () => {
    if (!project.externalUrl) return;
    try {
      const can = await Linking.canOpenURL(project.externalUrl);
      if (can) await Linking.openURL(project.externalUrl);
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.collageWrap}>
          {collage.map((uri, idx) => (
            <Image
              key={`${uri}-${idx}`}
              source={{ uri }}
              style={[
                styles.collageImage,
                idx === 0 && styles.topLeft,
                idx === 1 && styles.topRight,
                idx === 2 && styles.bottomLeft,
                idx === 3 && styles.bottomRight,
              ]}
            />
          ))}
        </View>

        <Dots count={3} active={activeDot} />

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.subtitle}>{project.subtitle}</Text>
          {!!project.externalUrl && (
            <TouchableOpacity activeOpacity={0.9} onPress={openExternal} style={styles.openPill}>
              <Ionicons name="open-outline" size={16} color={colors.primary} />
              <Text style={styles.openPillText}>Open in Spatial</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="document-text-outline" size={20} color="#111827" />
            </View>
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.body}>{project.description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons name="information-circle-outline" size={20} color="#111827" />
            </View>
            <Text style={styles.sectionTitle}>Information</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>{project.info?.platform || "-"}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{project.info?.location || "-"}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{project.info?.type || "-"}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_RADIUS = 26;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },

  collageWrap: {
    width: width - spacing.xl * 2,
    height: 220,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  collageImage: {
    width: "50%",
    height: "50%",
  },
  topLeft: {},
  topRight: {},
  bottomLeft: {},
  bottomRight: {},

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: spacing.m,
    marginBottom: spacing.l,
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
    alignItems: "flex-start",
    marginTop: spacing.s,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
    lineHeight: 34,
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
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.l,
    marginBottom: spacing.l,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },

  body: {
    fontSize: 15,
    lineHeight: 24,
    color: "#374151",
  },

  infoCard: {
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    padding: spacing.xl,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.l,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    flex: 1,
    textAlign: "right",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: spacing.l,
  },
});
