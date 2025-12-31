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

// Dummy images (boleh diganti dengan asset lokal kamu)
const demoEventImg = {
  uri: "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=900&q=60",
};
const demoToolImg = {
  uri: "https://images.unsplash.com/photo-1587573578277-8d80a382440e?auto=format&fit=crop&w=900&q=60",
};

function getInitials(fullNameOrEmail) {
  if (!fullNameOrEmail) return "U";
  const s = String(fullNameOrEmail).trim();
  if (!s) return "U";
  if (s.includes("@")) return s.slice(0, 2).toUpperCase();
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SectionHeader({ title, onSeeMore }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onSeeMore} hitSlop={10}>
        <Text style={styles.seeMore}>See More</Text>
      </Pressable>
    </View>
  );
}

function PillButton({ label, onPress, variant = "outline" }) {
  const isSolid = variant === "solid";
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pillBtn, isSolid ? styles.pillSolid : styles.pillOutline]}
    >
      <Text style={[styles.pillText, isSolid ? styles.pillTextSolid : styles.pillTextOutline]}>
        {label}
      </Text>
    </Pressable>
  );
}

function IconCircle({ name }) {
  return (
    <View style={styles.iconCircle}>
      <Ionicons name={name} size={26} color={colors.primaryDark} />
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  // kita bikin struktur "me" selaras sama yang kamu pakai sebelumnya
  // me = { email, profileCompleted, profile: { fullName, nik, birthDate, address } }
  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(false);

  const loadMe = async () => {
    setLoadingMe(true);
    try {
      // 1) ambil user supabase yang sedang login
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;

      const user = authData?.user;
      if (!user) {
        setMe(null);
        return;
      }

      // 2) ambil profile dari table "profiles" (yang kamu isi di (auth)/data.jsx)
      const { data: profileRow, error: pErr } = await supabase
        .from("profiles")
        .select("name, nik, birth_date, address")
        .eq("id", user.id)
        .maybeSingle();

      if (pErr) throw pErr;

      const profile = profileRow
        ? {
            fullName: profileRow.name || "",
            nik: profileRow.nik || "",
            birthDate: profileRow.birth_date || "",
            address: profileRow.address || "",
          }
        : null;

      const profileCompleted =
        !!profile?.fullName && !!profile?.nik && !!profile?.birthDate && !!profile?.address;

      setMe({
        email: user.email,
        profileCompleted,
        profile,
      });
    } catch (e) {
      console.log("HOME loadMe error:", e?.message);
      setMe(null);
    } finally {
      setLoadingMe(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const displayName = useMemo(() => {
    const p = me?.profile || {};
    if (p.fullName) return p.fullName;
    if (me?.email) return me.email;
    return "Username";
  }, [me]);

  const profileStatus = useMemo(() => {
    if (loadingMe) return "Loading...";
    if (!me) return "Profile status";
    return me.profileCompleted ? "Profile completed" : "Complete your profile";
  }, [me, loadingMe]);

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  // Tetap pakai featured dummy card (UI kamu tetap sama)
  const featuredEvent = {
    title: "Virtual Reality (VR)\nDevelopment Workshop",
    author: "Bernard Marr",
    date: "Monday, 29th December 2025",
    time: "11:00 AM",
    image: demoEventImg,
  };

  const featuredTool = {
    title: "Haptic Gloves",
    qty: 2,
    desc: "Feel the virtual world with high-fidelity tactile\nfeedback for your hands.",
    image: demoToolImg,
  };

  const featuredProject = {
    badge: "Seat.In Exhibition 2025",
    text:
      "ITB Metaverse ITB East Hall is a collaborative work of 4 F/S: FSRD ITB, STEI ITB, FITB ITB, SAPPK ITB.",
    image: {
      uri: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92eee?auto=format&fit=crop&w=900&q=60",
    },
  };

  const teamMember = {
    name: "Nadia Apsarini Baizal",
    role: "Laboratory Director",
    dept: "Sistem dan Teknologi Informasi",
    year: "2024/2025",
    avatar: {
      uri: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=256&q=60",
    },
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top header */}
        <View style={styles.topRow}>
          <Pressable style={styles.profileLeft} onPress={() => router.push("/(app)/profile")}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.username} numberOfLines={1}>
                {displayName}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.status} numberOfLines={1}>
                  {profileStatus}
                </Text>
                {loadingMe ? <ActivityIndicator size="small" /> : null}
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(app)/notification")}
            style={styles.notifBtn}
            hitSlop={10}
          >
            <Ionicons name="notifications-outline" size={26} color="#111827" />
          </Pressable>
        </View>

        {/* Quick actions */}
        <View style={styles.quickWrap}>
          <View style={styles.rogaTopRow}>
            <View style={styles.rogaWrap2}>
              <Image source={roga} style={styles.roga2} resizeMode="contain" />
            </View>

            <View style={styles.greetingRight}>
              <Text style={styles.rogaGreeting2}>
                Hello, I’m Roga.{"\n"}How can I help you?
              </Text>
            </View>
          </View>

          <View style={styles.quickCardsRow2}>
            <Pressable style={styles.quickCard2} onPress={() => router.push("/(app)/(tabs)/facility")}>
              <IconCircle name="construct-outline" />
              <Text style={styles.quickText2} numberOfLines={2} ellipsizeMode="tail">
                Tool’s{"\n"}Booking
              </Text>
            </Pressable>

            <Pressable style={styles.quickCard2} onPress={() => router.push("/(app)/(tabs)/event")}>
              <IconCircle name="easel-outline" />
              <Text style={styles.quickText2} numberOfLines={2} ellipsizeMode="tail">
                Event{"\n"}Registration
              </Text>
            </Pressable>

            <Pressable style={styles.quickCard2} onPress={() => router.push("/(app)/(tabs)/project")}>
              <IconCircle name="hardware-chip-outline" />
              <Text style={styles.quickText2} numberOfLines={2} ellipsizeMode="tail">
                Metaverse’s{"\n"}Project
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Events */}
        <SectionHeader title="Join the Event!" onSeeMore={() => router.push("/(app)/(tabs)/event")} />

        <View style={styles.cardLarge}>
          <View style={styles.cardTopRow}>
            <Image source={featuredEvent.image} style={styles.cardThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{featuredEvent.title}</Text>
              <Text style={styles.cardSub}>{featuredEvent.author}</Text>

              <View style={styles.pillRow}>
                <PillButton label="Details" onPress={() => alert("Event details (todo)")} />
                <PillButton label="Register Now" variant="outline" onPress={() => alert("Register event (todo)")} />
              </View>
            </View>
          </View>

          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={18} color="#0F172A" />
              <Text style={styles.infoText}>{featuredEvent.date}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={18} color="#0F172A" />
              <Text style={styles.infoText}>{featuredEvent.time}</Text>
            </View>
          </View>
        </View>

        {/* Tools */}
        <SectionHeader title="Available Tools" onSeeMore={() => router.push("/(app)/(tabs)/facility")} />
        <View style={styles.cardLarge}>
          <View style={styles.cardTopRow}>
            <Image source={featuredTool.image} style={styles.cardThumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitleSingle}>{featuredTool.title}</Text>
              <Text style={styles.cardSub}>Quantity : {featuredTool.qty}</Text>

              <View style={styles.pillRow}>
                <PillButton label="Details" onPress={() => alert("Tool details (todo)")} />
                <PillButton label="Book Now" onPress={() => alert("Booking tool (todo)")} />
              </View>
            </View>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{featuredTool.desc}</Text>
          </View>
        </View>

        {/* Project */}
        <SectionHeader title="Check Out Our Project!" onSeeMore={() => router.push("/(app)/(tabs)/project")} />
        <View style={styles.cardLarge}>
          <View style={styles.projectRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.badge}>{featuredProject.badge}</Text>
              <Text style={styles.projectText}>{featuredProject.text}</Text>
            </View>
            <Image source={featuredProject.image} style={styles.projectImg} />
          </View>
        </View>

        {/* Organization / Team */}
        <SectionHeader title="Meet Our Team!" onSeeMore={() => router.push("/(app)/(tabs)/organization")} />
        <Pressable style={styles.teamCard} onPress={() => alert("Open member profile / chat (todo)")}>
          <Image source={teamMember.avatar} style={styles.teamAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.teamName}>{teamMember.name}</Text>
            <Text style={styles.teamSub}>{teamMember.dept}</Text>
            <Text style={styles.teamSub}>{teamMember.year}</Text>
            <View style={styles.rolePill}>
              <Text style={styles.rolePillText}>{teamMember.role}</Text>
            </View>
          </View>
        </Pressable>

        <View style={{ height: 24 }} />
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
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: "rgba(15,23,42,0.55)",
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
