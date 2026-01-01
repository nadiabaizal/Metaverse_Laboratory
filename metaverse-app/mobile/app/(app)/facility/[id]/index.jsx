import React, { useEffect, useState, useMemo } from "react";
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
import { supabase } from "../../../../src/lib/supabase";

const PRIMARY = "#2D2A7B";
const { width } = Dimensions.get("window");

export default function FacilityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [tool, setTool] = useState(null);
  const [tab, setTab] = useState("description");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchFacility = async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, name, description, how_to_use, cover_image, stock")
        .eq("id", id)
        .single();

      if (error) {
        console.error("FETCH FACILITY DETAIL ERROR:", error);
      }

      setTool(data || null);
      setLoading(false);
    };

    if (id) fetchFacility();
  }, [id]);

  /* ================= CONTENT LOGIC (AMAN) ================= */
  const contentText = useMemo(() => {
    if (!tool) return "";
    return tab === "description"
      ? tool.description
      : tool.how_to_use;
  }, [tab, tool]);

  /* ================= EARLY RETURN ================= */
  if (loading) return null;

  if (!tool) {
    return (
      <SafeAreaView style={styles.safeOnly}>
        <View style={styles.headerOverlay}>
          <Pressable onPress={() => router.back()} style={styles.backOverlay}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>
        </View>
        <View style={{ padding: spacing.xl }}>
          <Text style={{ fontSize: 18, fontWeight: "900" }}>
            Tool not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ================= UI (TIDAK DIUBAH) ================= */
  return (
    <View style={styles.screen}>
      <Image source={{ uri: tool.cover_image }} style={styles.hero} />

      <SafeAreaView style={styles.headerOverlay}>
        <Pressable onPress={() => router.back()} style={styles.backOverlay}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
      </SafeAreaView>

      <View style={styles.sheet}>
        <View style={styles.handle} />

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <Text style={styles.title}>{tool.name}</Text>

          <Text
            style={[
              styles.bookedText,
              tool.stock === 0 && { color: "#EF4444" },
            ]}
          >
            {tool.stock > 0
              ? `${tool.stock} more left`
              : "Fully Booked"}
          </Text>

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
              onPress={() => setTab("how_to_use")}
              style={[styles.segItem, tab === "how_to_use" && styles.segActive]}
            >
              <Text style={[styles.segText, tab === "how_to_use" && styles.segTextActive]}>
                How To Use?
              </Text>
            </Pressable>
          </View>

          <View style={styles.dashedBox}>
            <Text key={tab} style={styles.descText}>
              {contentText}
            </Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          style={[styles.bookBtn, tool.stock === 0 && { opacity: 0.55 }]}
          disabled={tool.stock === 0}
          onPress={() =>
            router.push({
              pathname: "/(app)/facility/[id]/booking",
              params: { id: tool.id },
            })
          }
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ================= STYLES (AS IS) ================= */
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
  },
  handle: {
    alignSelf: "center",
    width: 54,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D1D5DB",
    marginBottom: 10,
  },
  title: { fontSize: 30, fontWeight: "900" },
  bookedText: { marginTop: 6, fontSize: 14, fontWeight: "900" },
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
  },
  descText: { fontSize: 15, fontWeight: "700", textAlign: "center" },
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
