import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { supabase } from "../../../../src/lib/supabase";
import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";

const TABS = [
  { key: "about", label: "Deskripsi" },
  { key: "contact", label: "Kontak" },
];

export default function OrganizationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [member, setMember] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [fav, setFav] = useState(false);

  /* ===== FETCH DETAIL DARI SUPABASE ===== */
  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("organization_members")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("SUPABASE DETAIL ERROR:", error);
        return;
      }

      setMember({
        ...data,
        image: data.image_url ? { uri: data.image_url } : null,
        roleText: data.job_title, // utk UI lama
        category: data.role,
      });
    };

    fetchMember();
  }, [id]);

  /* ===== OPENERS ===== */
  const openPhone = (phone) => {
    if (!phone) return Alert.alert("Info", "Nomor telepon belum tersedia.");
    Linking.openURL(`tel:${phone}`);
  };

  const openEmail = (email) => {
    if (!email) return Alert.alert("Info", "Email belum tersedia.");
    Linking.openURL(`mailto:${email}`);
  };

  const openLink = (url) => {
    if (!url) return Alert.alert("Info", "Kontak belum tersedia.");
    Linking.openURL(url);
  };

  /* ===== LOADING STATE ===== */
  if (!member) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", padding: spacing.xl }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>
          Memuat data member...
        </Text>
      </View>
    );
  }

  /* ===== UI (TETAP) ===== */
  return (
    <View style={styles.screen}>
      {/* HERO */}
      <View style={styles.hero}>
        <Image source={member.image} style={styles.heroImage} />

        <SafeAreaView style={styles.safeTop}>
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </Pressable>

            <Pressable onPress={() => setFav((v) => !v)} style={styles.favBtn}>
              <Ionicons
                name={fav ? "heart" : "heart-outline"}
                size={22}
                color={fav ? "#EF4444" : colors.primary}
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerBlock}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.role}>{member.roleText}</Text>

            <View style={styles.badgeRow}>
              {!!member.category && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{member.category}</Text>
                </View>
              )}
            </View>
          </View>

          {/* TABS */}
          <View style={styles.segmentOuter}>
            <View style={styles.segment}>
              {TABS.map((t) => (
                <Pressable
                  key={t.key}
                  onPress={() => setActiveTab(t.key)}
                  style={[
                    styles.segItem,
                    activeTab === t.key && styles.segItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segText,
                      activeTab === t.key && styles.segTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {activeTab === "about" ? (
            <View style={styles.section}>
              <Text style={styles.paragraph}>
                {member.about || "Deskripsi belum tersedia."}
              </Text>
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.contactGrid}>
                <ContactButton icon="call-outline" label="Telepon" onPress={() => openPhone(member.phone)} />
                <ContactButton icon="mail-outline" label="Email" onPress={() => openEmail(member.email)} />
                <ContactButton icon="logo-instagram" label="Instagram" onPress={() => openLink(member.instagram)} />
                <ContactButton icon="logo-linkedin" label="LinkedIn" onPress={() => openLink(member.linkedin)} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable style={styles.primaryBtn} onPress={() => openEmail(member.email)}>
            <Text style={styles.primaryBtnText}>Hubungi Sekarang</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ===== CONTACT BUTTON ===== */
function ContactButton({ icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.contactBtn}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.contactLabel}>{label}</Text>
    </Pressable>
  );
}

/* ===== STYLES (AS IS) ===== */
const styles = StyleSheet.create({
  /* 🔒 TIDAK DIUBAH */
  screen: { flex: 1, backgroundColor: "#fff" },
  hero: { height: 320, backgroundColor: "#DCEEFF" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  safeTop: { position: "absolute", top: 0, left: 0, right: 0 },
  topRow: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  favBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  sheet: { flex: 1, marginTop: -22, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: "#fff" },
  handle: { alignSelf: "center", marginTop: 10, width: 90, height: 6, borderRadius: 99, backgroundColor: "#C7CDD3" },
  headerBlock: { padding: spacing.xl },
  name: { fontSize: 28, fontWeight: "900" },
  role: { marginTop: 6, fontSize: 16, color: "#9CA3AF" },
  badgeRow: { marginTop: spacing.l },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: "#EEE9FF" },
  badgeText: { fontWeight: "800", color: colors.primary },
  segmentOuter: { paddingHorizontal: spacing.xl },
  segment: { flexDirection: "row", backgroundColor: "#F3F4F6", borderRadius: 30, padding: 6 },
  segItem: { flex: 1, height: 44, alignItems: "center", justifyContent: "center" },
  segItemActive: { backgroundColor: colors.primary, borderRadius: 24 },
  segText: { fontWeight: "800", color: "#9CA3AF" },
  segTextActive: { color: "#fff" },
  section: { padding: spacing.xl },
  paragraph: { fontSize: 16, lineHeight: 26 },
  contactGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.l },
  contactBtn: { width: "47%", padding: spacing.l, borderRadius: 18, backgroundColor: "#F4F2FF", alignItems: "center", gap: 8 },
  contactLabel: { fontWeight: "800" },
  bottomBar: { padding: spacing.xl },
  primaryBtn: { height: 56, borderRadius: 18, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  primaryBtnText: { color: "#fff", fontSize: 18, fontWeight: "900" },
});
