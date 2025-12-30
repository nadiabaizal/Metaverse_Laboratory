import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";
import { getEventById } from "../../../../src/data/mockEvents";

const { width: SCREEN_W } = Dimensions.get("window");
const HERO_W = SCREEN_W - spacing.l * 2;
const HERO_H = 220;

export default function EventDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "unity-vr";
  const event = useMemo(() => getEventById(eventId), [eventId]);

  const [page, setPage] = useState(0);
  const carouselRef = useRef(null);

  const onScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / HERO_W);
    if (idx !== page) setPage(idx);
  };

  const goRegister = () => router.push({ pathname: "/(app)/event/[id]/register", params: { id: event.id } });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: spacing.l }}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            snapToInterval={HERO_W}
            decelerationRate="fast"
          >
            {(event.images || []).map((uri, idx) => (
              <View key={uri + idx} style={{ width: HERO_W }}>
                <Image source={{ uri }} style={styles.heroImg} />
              </View>
            ))}
          </ScrollView>

          <View style={styles.dotsRow}>
            {(event.images || []).map((_, idx) => (
              <View key={idx} style={[styles.dot, idx === page && styles.dotActive]} />
            ))}
          </View>

          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.org}>{event.org}</Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={goRegister} activeOpacity={0.9}>
            <Text style={styles.primaryBtnText}>Register Now</Text>
          </TouchableOpacity>

          <SectionTitle icon="reader-outline" title="Description" />
          <Text style={styles.paragraph}>{event.description}</Text>

          <SectionTitle icon="list-outline" title="Requirements" />
          <View style={{ marginTop: 6 }}>
            {(event.requirements || []).map((r, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{r}</Text>
              </View>
            ))}
          </View>

          <SectionTitle icon="information-circle-outline" title="Information" />
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{event.location}</Text>

            <View style={{ height: 14 }} />

            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{event.dateLabel}</Text>

            <View style={{ height: 14 }} />

            <Text style={styles.infoLabel}>Time</Text>
            <Text style={styles.infoValue}>{event.timeLabel}</Text>

            <View style={{ height: 14 }} />

            <Text style={styles.infoLabel}>Seats left</Text>
            <Text style={styles.infoValue}>{event.seatsLeft}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <View style={styles.sectionRow}>
      <Ionicons name={icon} size={28} color="#111827" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
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

  heroImg: {
    width: HERO_W,
    height: HERO_H,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
  },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 12, marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 10, backgroundColor: "#D1D5DB" },
  dotActive: { backgroundColor: "#2D2A7B" },

  title: { marginTop: 10, fontSize: 34, fontWeight: "900", color: "#0F172A" },
  org: { marginTop: 8, fontSize: 18, fontWeight: "700", color: "#9CA3AF" },

  primaryBtn: {
    marginTop: spacing.xl,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#2D2A7B",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 22, fontWeight: "900", color: "#FFFFFF" },

  sectionRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 34 },
  sectionTitle: { fontSize: 30, fontWeight: "900", color: "#111827" },

  paragraph: {
    marginTop: 14,
    fontSize: 18,
    lineHeight: 28,
    color: "#334155",
    textAlign: "left",
  },

  bulletRow: { flexDirection: "row", gap: 10, marginTop: 10, paddingRight: 10 },
  bullet: { fontSize: 22, lineHeight: 26, color: "#334155" },
  bulletText: { flex: 1, fontSize: 18, lineHeight: 26, color: "#334155" },

  infoCard: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    padding: spacing.l,
    backgroundColor: "#FFFFFF",
  },
  infoLabel: { fontSize: 14, fontWeight: "900", color: "#94A3B8", letterSpacing: 0.6, textTransform: "uppercase" },
  infoValue: { marginTop: 4, fontSize: 18, fontWeight: "800", color: "#0F172A" },
});
