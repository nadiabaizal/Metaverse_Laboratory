import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";
import { supabase } from "../../../../src/lib/supabase";

const roga = require("../../../../assets/images/roga.png");

/* ================= UTIL ================= */
function getInitials(v) {
  if (!v) return "U";
  if (v.includes("@")) return v.slice(0, 2).toUpperCase();
  const p = v.split(" ");
  return p.length === 1
    ? p[0].slice(0, 2).toUpperCase()
    : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ================= MAIN ================= */
export default function HomeScreen() {
  const router = useRouter();

  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(false);

  const [event, setEvent] = useState(null);
  const [tool, setTool] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [projects, setProjects] = useState([]);

  /* ---------- LOAD USER ---------- */
  const loadMe = async () => {
    setLoadingMe(true);
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) {
        setMe(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, nik, birth_date, address")
        .eq("id", user.id)
        .maybeSingle();

      const profileCompleted =
        !!profile?.name &&
        !!profile?.nik &&
        !!profile?.birth_date &&
        !!profile?.address;

      setMe({
        email: user.email,
        profileCompleted,
        profile,
      });
    } catch (e) {
      console.log("loadMe error:", e.message);
    } finally {
      setLoadingMe(false);
    }
  };

  /* ---------- LOAD HOME DATA ---------- */
  const loadHomeData = async () => {
    try {
      const { data: e } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setEvent(e || null);

      const { data: f } = await supabase
        .from("facilities")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setTool(f || null);

      const { data: o } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setOrganization(o || null);

      const { data: p } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setProjects(o || null);

    } catch (e) {
      console.log("loadHomeData error:", e.message);
    }
  };

  useEffect(() => {
    loadMe();
    loadHomeData();
  }, []);

  const displayName = useMemo(() => {
    if (me?.profile?.name) return me.profile.name;
    if (me?.email) return me.email;
    return "Username";
  }, [me]);

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const profileStatus = useMemo(() => {
    if (loadingMe) return "Loading...";
    if (!me) return "Profile status";
    return me.profileCompleted ? "Profile completed" : "Complete your profile";
  }, [me, loadingMe]);

  /* ================= RENDER ================= */
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.topRow}>
          <Pressable style={styles.profileLeft} onPress={() => router.push("/(app)/profile")}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={styles.username}>{displayName}</Text>
              <Text style={styles.status}>{profileStatus}</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/(app)/notification")}>
            <Ionicons name="notifications-outline" size={26} />
          </Pressable>
        </View>

        {/* ROGA */}
        <View style={styles.rogaTopRow}>
          <Image source={roga} style={styles.roga2} />
          <Text style={styles.rogaGreeting2}>
            Hello, I’m Roga.{"\n"}How can I help you?
          </Text>
        </View>

        {/* QUICK ACTION */}
        <View style={styles.quickCardsRow2}>
          <Pressable 
            style={styles.quickCard2} 
            onPress={() => router.push("/(app)/(tabs)/facility")}
          >
            <Ionicons name="construct-outline" size={26} color={colors.primaryDark} />
            <Text style={styles.quickText2}>Tool’s{"\n"}Booking</Text>
          </Pressable>

          <Pressable 
            style={styles.quickCard2} 
            onPress={() => router.push("/(app)/(tabs)/event")}
            >
            <Ionicons name="easel-outline" size={26} color={colors.primaryDark} />
            <Text style={styles.quickText2}>Event{"\n"}Registration</Text>
          </Pressable>

          <Pressable
            style={styles.quickCard2}
            onPress={() => router.push("/(app)/(tabs)/project")}
          >
            <Ionicons name="briefcase-outline" size={26} color={colors.primaryDark} />
            <Text style={styles.quickText2}>Our Project</Text>
          </Pressable>

          <Pressable
            style={styles.quickCard2}
            onPress={() => router.push("/(app)/(tabs)/organization")}
          >
            <Ionicons name="people-outline" size={26} color={colors.primaryDark} />
            <Text style={styles.quickText2}>Our People</Text>
          </Pressable>
        </View>

        {/* EVENT */}
        {event && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Join the Event!</Text>
              <Pressable onPress={() => router.push("/(app)/(tabs)/event")}>
                <Text style={styles.seeMore}>See More</Text>
              </Pressable>
            </View>

            <View style={styles.cardLarge}>
              <View style={styles.cardTopRow}>
                <Image source={{ uri: event.cover_image }} style={styles.cardThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{event.title}</Text>
                  <Text style={styles.cardSub}>{event.location}</Text>

                  <View style={styles.pillRow}>
                    <Pressable onPress={() => router.push(`/(app)/event/${event.id}`)}>
                      <Text style={styles.seeMore}>Details</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push(`/(app)/event/${event.id}/register`)}>
                      <Text style={styles.seeMore}>Register Now</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={styles.infoBar}>
                <Text>{formatDate(event.event_date)}</Text>
                <Text>{event.event_start_time}</Text>
              </View>
            </View>
          </>
        )}

        {/* TOOL */}
        {tool && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Available Tools</Text>
              <Pressable onPress={() => router.push("/(app)/(tabs)/facility")}>
                <Text style={styles.seeMore}>See More</Text>
              </Pressable>
            </View>

            <View style={styles.cardLarge}>
              <View style={styles.cardTopRow}>
                <Image source={{ uri: tool.cover_image }} style={styles.cardThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitleSingle}>{tool.name}</Text>
                  <Text style={styles.cardSub}>Quantity : {tool.stock}</Text>

                  <View style={styles.pillRow}>
                    <Pressable onPress={() => router.push(`/(app)/facility/${tool.id}`)}>
                      <Text style={styles.seeMore}>Details</Text>
                    </Pressable>
                    <Pressable onPress={() => router.push(`/(app)/facility/${tool.id}/booking`)}>
                      <Text style={styles.seeMore}>Book Now</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={styles.noteBox}>
                <Text style={styles.noteText}>{tool.description}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: 14,
    paddingBottom: 120,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  profileLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "900", color: "#2563EB" },
  username: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  status: { fontSize: 13, fontWeight: "600", color: "rgba(15,23,42,0.55)", marginTop: 2 },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  quickWrap: { marginBottom: 10 },
  rogaTopRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 18 },
  rogaWrap2: { width: 140, height: 120, backgroundColor: "transparent" },
  roga2: { width: 140, height: 140, backgroundColor: "transparent" },
  greetingRight: { flex: 1, justifyContent: "center" },
  rogaGreeting2: { fontSize: 22, lineHeight: 36, fontWeight: "900", color: "#0F172A" },
  quickCardsRow2: { flexDirection: "row", gap: 10, justifyContent: "space-between" },
  quickCard2: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F1F5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  quickText2: {
    textAlign: "center",
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: "500",
    color: "rgba(9, 14, 26, 0.55)",
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 28, fontWeight: "900", color: "#0F172A" },
  seeMore: { fontSize: 16, fontWeight: "800", color: colors.primaryDark },

  cardLarge: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 14,
    marginBottom: 6,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  cardTopRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  cardThumb: { width: 118, height: 86, borderRadius: 18, backgroundColor: "#E2E8F0" },
  cardTitle: { fontSize: 18, fontWeight: "900", color: "#0F172A", lineHeight: 22 },
  cardTitleSingle: { fontSize: 20, fontWeight: "900", color: "#0F172A" },
  cardSub: { fontSize: 14, fontWeight: "700", color: "rgba(15,23,42,0.45)", marginTop: 4 },

  pillRow: { flexDirection: "row", gap: 10, marginTop: 10, flexWrap: "nowrap" },
  pillBtn: { height: 40, paddingHorizontal: 12, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  pillOutline: { borderWidth: 2, borderColor: colors.primaryDark, backgroundColor: "#FFFFFF" },
  pillSolid: { borderWidth: 2, borderColor: colors.primaryDark, backgroundColor: "#FFFFFF" },
  pillText: { fontSize: 14, fontWeight: "800" },
  pillTextOutline: { color: colors.primaryDark },
  pillTextSolid: { color: colors.primaryDark },

  infoBar: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  infoText: { fontSize: 14, fontWeight: "800", color: "#0F172A", flexShrink: 1 },

  noteBox: { marginTop: 12, borderRadius: 18, backgroundColor: "#F1F5F9", padding: 12 },
  noteText: { fontSize: 14, fontWeight: "700", color: "rgba(15,23,42,0.7)", lineHeight: 18 },

  projectRow: { flexDirection: "row", alignItems: "center" },
  badge: { color: "#2B246B", fontSize: 22, lineHeight: 28, fontWeight: "900", marginBottom: 8 },
  projectText: { fontSize: 14, lineHeight: 20, fontWeight: "600", color: "rgba(15,23,42,0.6)" },
  projectImg: { width: 120, height: 90, borderRadius: 22, backgroundColor: "#E2E8F0" },

  teamCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 22,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(124, 88, 255, 0.35)",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  teamAvatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: "#E2E8F0" },
  teamName: { fontSize: 22, fontWeight: "900", color: "#0F172A" },
  teamSub: { fontSize: 14, fontWeight: "700", color: "rgba(15,23,42,0.45)", marginTop: 2 },
  rolePill: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryDark,
  },
  rolePillText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
});
