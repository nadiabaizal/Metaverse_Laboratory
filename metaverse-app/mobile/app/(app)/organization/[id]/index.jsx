import React, { useMemo, useState } from "react";
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

import { organizationMembers } from "../../../../src/data/mockOrganization";
import { colors } from "../../../../src/theme/colors";
import { spacing } from "../../../../src/theme/spacing";

const TABS = [
  { key: "about", label: "Deskripsi" },
  { key: "contact", label: "Kontak" },
];

export default function OrganizationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("about");
  const [fav, setFav] = useState(false);

  const member = useMemo(() => {
    const found = organizationMembers.find((m) => String(m.id) === String(id));
    return found || null;
  }, [id]);

  const openLink = async (url) => {
    if (!url) {
      Alert.alert("Info", "Kontak belum tersedia.");
      return;
    }
    try {
      const ok = await Linking.canOpenURL(url);
      if (!ok) {
        Alert.alert("Tidak bisa dibuka", "Link tidak didukung di device ini.");
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Gagal", "Tidak dapat membuka link.");
    }
  };

  if (!member) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff", padding: spacing.xl }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>
          Member tidak ditemukan
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontWeight: "800" }}>Kembali</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* HERO */}
      <View style={styles.hero}>
        <Image source={member.image} style={styles.heroImage} />

        {/* top actions */}
        <SafeAreaView style={styles.safeTop}>
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </Pressable>

            <Pressable
              onPress={() => setFav((v) => !v)}
              style={styles.favBtn}
              hitSlop={12}
            >
              <Ionicons
                name={fav ? "heart" : "heart-outline"}
                size={22}
                color={fav ? "#EF4444" : "#2563EB"}
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      {/* BOTTOM SHEET */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          {/* Header Info */}
          <View style={styles.headerBlock}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>
                {member.name}
              </Text>
              <Text style={styles.role} numberOfLines={2}>
                {member.role}
              </Text>

              <View style={styles.badgeRow}>
                {!!member.category && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{member.category}</Text>
                  </View>
                )}
                <View style={styles.miniInfo}>
                  <Ionicons name="briefcase-outline" size={16} color={colors.primary} />
                  <Text style={styles.miniInfoText}>Metaverse Lab ITB</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Segmented Tabs */}
          <View style={styles.segmentOuter}>
            <View style={styles.segment}>
              {TABS.map((t) => {
                const active = t.key === activeTab;
                return (
                  <Pressable
                    key={t.key}
                    onPress={() => setActiveTab(t.key)}
                    style={[styles.segItem, active && styles.segItemActive]}
                  >
                    <Text style={[styles.segText, active && styles.segTextActive]}>
                      {t.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Content */}
          {activeTab === "about" ? (
            <View style={styles.section}>
              <SectionTitle icon="document-text-outline" title="Tentang" />
              <Text style={styles.paragraph}>
                {member.about ||
                  `Saya ${member.name} bekerja di Metaverse Laboratory ITB. Fokus saya terkait ${member.role}. 
Saya terbuka untuk kolaborasi, diskusi riset, dan pengembangan proyek XR/VR/AI sesuai kebutuhan lab.`}
              </Text>

              <SectionTitle icon="information-circle-outline" title="Informasi" />
              <View style={styles.infoCard}>
                <InfoRow label="Divisi" value={member.category || "-"} />
                <InfoRow label="Peran" value={member.role || "-"} />
                <InfoRow label="Lab" value="Metaverse Laboratory ITB" />
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <SectionTitle icon="chatbubble-ellipses-outline" title="Kontak" />

              <View style={styles.contactGrid}>
                <ContactButton
                  icon="call-outline"
                  label="Telepon"
                  onPress={() => openLink(member.phone)}
                />
                <ContactButton
                  icon="mail-outline"
                  label="Email"
                  onPress={() => openLink(member.email)}
                />
                <ContactButton
                  icon="logo-instagram"
                  label="Instagram"
                  onPress={() => openLink(member.instagram)}
                />
                <ContactButton
                  icon="logo-linkedin"
                  label="LinkedIn"
                  onPress={() => openLink(member.linkedin)}
                />
              </View>

              <View style={{ marginTop: spacing.xl }}>
                <SectionTitle icon="shield-checkmark-outline" title="Catatan" />
                <Text style={styles.paragraphMuted}>
                  Gunakan kontak ini untuk keperluan kolaborasi, event lab, atau pertanyaan terkait
                  proyek. Mohon tetap sopan dan jelas dalam menyampaikan maksud komunikasi.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* CTA bottom */}
        <View style={styles.bottomBar}>
          <Pressable style={styles.primaryBtn} onPress={() => openLink(member.email)}>
            <Text style={styles.primaryBtnText}>Hubungi Sekarang</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ---------- small components ---------- */

function SectionTitle({ icon, title }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Ionicons name={icon} size={22} color="#111827" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function ContactButton({ icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.contactBtn}>
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.contactLabel}>{label}</Text>
    </Pressable>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  hero: {
    height: 320,
    backgroundColor: "#DCEEFF",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  safeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  topRow: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  favBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },

  sheet: {
    flex: 1,
    marginTop: -22,
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    overflow: "hidden",
  },
  handle: {
    alignSelf: "center",
    marginTop: 10,
    width: 90,
    height: 6,
    borderRadius: 99,
    backgroundColor: "#C7CDD3",
  },

  headerBlock: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  name: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },
  role: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  badgeRow: {
    marginTop: spacing.l,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.m,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EEE9FF",
    borderWidth: 1,
    borderColor: "#DED4FF",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.primary,
  },
  miniInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniInfoText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    opacity: 0.8,
  },

  segmentOuter: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    padding: 6,
    gap: 6,
  },
  segItem: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  segItemActive: {
    backgroundColor: colors.primary,
  },
  segText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#9CA3AF",
  },
  segTextActive: {
    color: "#fff",
  },

  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: spacing.l,
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: "#374151",
  },
  paragraphMuted: {
    fontSize: 15,
    lineHeight: 24,
    color: "#6B7280",
  },

  infoCard: {
    marginTop: spacing.m,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFB",
    padding: spacing.l,
  },
  infoRow: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    opacity: 0.75,
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  contactGrid: {
    marginTop: spacing.m,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.l,
  },
  contactBtn: {
    width: "47%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7E1FF",
    backgroundColor: "#F4F2FF",
    padding: spacing.l,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E7E1FF",
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },

  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
    backgroundColor: "#fff",
  },
  primaryBtn: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },
});
