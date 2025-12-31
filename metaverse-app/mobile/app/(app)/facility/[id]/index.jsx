import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { spacing } from "../../../../src/theme/spacing";
import { getFacilityById } from "../../../../src/data/mockFacilities";

const PRIMARY = "#2D2A7B";
const { width } = Dimensions.get("window");

export default function FacilityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const tool = useMemo(() => getFacilityById(String(id)), [id]);
  const [tab, setTab] = useState("description");

  if (!tool) {
    return (
      <SafeAreaView style={styles.safeOnly}>
        <View style={styles.headerOverlay}>
          <Pressable onPress={() => router.back()} style={styles.backOverlay} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>
        </View>
        <View style={{ padding: spacing.xl }}>
          <Text style={{ fontSize: 18, fontWeight: "900", color: "#111827" }}>Tool not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      {/* TOP IMAGE */}
      <Image source={{ uri: tool.images?.[0] }} style={styles.hero} />

      {/* BACK BUTTON (overlay) */}
      <SafeAreaView style={styles.headerOverlay}>
        <Pressable onPress={() => router.back()} style={styles.backOverlay} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
      </SafeAreaView>

      {/* BOTTOM SHEET */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <Text style={styles.title} numberOfLines={2}>
            {tool.title}
          </Text>
          <Text style={styles.bookedText}>Booked {tool.bookedCount} times!</Text>

          <View style={styles.segment}>
            <Pressable
              onPress={() => setTab("description")}
              style={[styles.segItem, tab === "description" && styles.segActive]}
            >
              <Text style={[styles.segText, tab === "description" && styles.segTextActive]}>
                Description
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab("howto")}
              style={[styles.segItem, tab === "howto" && styles.segActive]}
            >
              <Text style={[styles.segText, tab === "howto" && styles.segTextActive]}>
                How To Use?
              </Text>
            </Pressable>
          </View>

          <View style={styles.dashedBox}>
            <Text style={styles.descText}>
              {tab === "description" ? tool.description : tool.howToUse}
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* BOOK BUTTON */}
      <View style={styles.bottomBar} pointerEvents="box-none">
        <Pressable
          style={[styles.bookBtn, tool.available <= 0 && { opacity: 0.55 }]}
          onPress={() =>
            router.push({ pathname: "/(app)/facility/[id]/booking", params: { id: tool.id } })
          }
          disabled={tool.available <= 0}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  safeOnly: { flex: 1, backgroundColor: "#FFFFFF" },

  hero: { width: "100%", height: 360, backgroundColor: "#E5E7EB" },

  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  backOverlay: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
  },

  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    minHeight: 520,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
  },
  handle: {
    alignSelf: "center",
    width: 54,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D1D5DB",
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: 0.2,
  },
  bookedText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "900",
    color: "#EF4444",
  },

  segment: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    padding: 6,
    gap: 6,
    marginTop: spacing.l,
  },
  segItem: {
    flex: 1,
    height: 48,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  segActive: { backgroundColor: PRIMARY },
  segText: { fontSize: 14, fontWeight: "900", color: "#9CA3AF" },
  segTextActive: { color: "#FFFFFF" },

  dashedBox: {
    marginTop: spacing.xl,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(45,42,123,0.35)",
    borderRadius: 22,
    padding: spacing.xl,
    backgroundColor: "#FFFFFF",
  },
  descText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 22,
    textAlign: "center",
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: 24,
  },
  bookBtn: {
    height: 62,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  bookBtnText: { fontSize: 20, fontWeight: "900", color: "#FFFFFF" },
});
