import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "../../../../src/theme/spacing";
import { getEventById } from "../../../../src/data/mockEvents";

const { width: SCREEN_W } = Dimensions.get("window");
const HERO_W = SCREEN_W - spacing.l * 2;
const HERO_H = 220;

export default function EventDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const eventId =
    typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "unity-vr";

  const event = useMemo(() => getEventById(eventId), [eventId]);

  const [page, setPage] = useState(0);
  const carouselRef = useRef(null);

  const onScroll = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / HERO_W);
    if (idx !== page) setPage(idx);
  };

  const goRegister = () =>
    router.push({ pathname: "/(app)/event/[id]/register", params: { id: event.id } });

  const timeText = useMemo(() => {
    if (event?.timeLabel && event?.endTimeLabel) return `${event.timeLabel} - ${event.endTimeLabel}`;
    if (event?.timeLabel) return event.timeLabel;
    return "-";
  }, [event]);

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

          {/* ✅ Tambahan info lengkap */}
          <SectionTitle icon="information-circle-outline" title="Information" />
          <View style={styles.infoGrid}>
            <InfoItem icon="calendar-outline" label="Date" value={event.dateLabel || "-"} />
            <InfoItem icon="time-outline" label="Time" value={timeText} />
          </View>

          <View style={{ marginTop: 12 }}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Location</Text>
              <Text style={styles.infoSub}>{event.location || "-"}</Text>
            </View>
          </View>

          <View style={{ height: 14 }} />

          {(event.speakers || []).map((sp) => (
            <SpeakerCard key={sp.id} name={sp.name} role={sp.role} />
          ))}
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

function InfoItem({ icon, label, value }) {
  return (
    <View style={styles.infoMiniCard}>
      <View style={styles.infoMiniTop}>
        <Ionicons name={icon} size={20} color="#2D2A7B" />
        <Text style={styles.infoMiniLabel}>{label}</Text>
      </View>
      <Text style={styles.infoMiniValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function SpeakerCard({ name, role }) {
  return (
    <View style={styles.speakerCard}>
      <View style={styles.speakerIconBox}>
        <Ionicons name="mic-outline" size={22} color="#2563EB" />
        <View style={styles.speakerDot} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.speakerName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.speakerRole} numberOfLines={1}>
          {role}
        </Text>
      </View>
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

  // ✅ grid info time/date
  infoGrid: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  infoMiniCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    padding: spacing.l,
    backgroundColor: "#FFFFFF",
  },
  infoMiniTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoMiniLabel: { fontSize: 14, fontWeight: "900", color: "#111827" },
  infoMiniValue: { marginTop: 10, fontSize: 14, fontWeight: "800", color: "#64748B" },

  infoCard: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    padding: spacing.l,
    backgroundColor: "#FFFFFF",
  },
  infoTitle: { fontSize: 16, fontWeight: "900", color: "#111827" },
  infoSub: { marginTop: 8, fontSize: 14, fontWeight: "700", color: "#9CA3AF" },

  speakerCard: {
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  speakerIconBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  speakerDot: {
    position: "absolute",
    right: 10,
    bottom: 12,
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#EF4444",
  },
  speakerName: { fontSize: 16, fontWeight: "900", color: "#111827" },
  speakerRole: { marginTop: 4, fontSize: 13, fontWeight: "700", color: "#9CA3AF" },
});
