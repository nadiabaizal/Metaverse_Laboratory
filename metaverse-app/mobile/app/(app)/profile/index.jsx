import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "../../../src/lib/api";
import { colors } from "../../../src/theme/colors";
import { spacing } from "../../../src/theme/spacing";
import { supabase } from "../../../src/lib/supabase";

function getInitials(fullNameOrEmail) {
  if (!fullNameOrEmail) return "U";
  const s = String(fullNameOrEmail).trim();
  if (!s) return "U";
  if (s.includes("@")) return s.slice(0, 2).toUpperCase();
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Row({ icon, label, right, onPress, isLast }) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconBox}>
          <Ionicons name={icon} size={22} color={colors.primaryDark} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>

      <View style={styles.rowRight}>
        {right ?? <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />}
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  const [notif, setNotif] = useState(true);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ ambil data user hasil register dari backend
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/me");
        if (mounted) setMe(res.data?.user ?? null);
      } catch (e) {
          console.log("GET /me failed:", e?.response?.status, e?.message);

          // ✅ hanya redirect ke login kalau user BELUM logout manual
          if (e?.response?.status === 401) {
            router.replace("/(auth)/login");
          }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ mapping data profile hasil register
  const name = useMemo(() => {
    return me?.profile?.fullName || me?.profile?.name || me?.email || "Username";
  }, [me]);

  const email = useMemo(() => {
    return me?.email || "username@stei.itb.ac.id";
  }, [me]);

  // kalau backend kamu punya avatar url, pakai di sini:
  const avatarUri = useMemo(() => {
    // contoh: me?.profile?.avatarUrl
    return me?.profile?.avatarUrl || null;
  }, [me]);

  const initials = useMemo(() => getInitials(name || email), [name, email]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/(app)/profile/edit")}
          hitSlop={10}
          style={styles.editBtn}
        >
          <Ionicons name="create-outline" size={26} color={colors.primaryDark} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : null}

      <View style={styles.divider} />

      {/* Menu */}
      <View style={styles.menu}>
        <Row
          icon="notifications-outline"
          label="Notification"
          right={
            <Switch
              value={notif}
              onValueChange={setNotif}
              trackColor={{ false: "#E5E7EB", true: "#A78BFA" }}
              thumbColor={notif ? colors.primaryDark : "#FFFFFF"}
            />
          }
          onPress={() => setNotif((v) => !v)}
        />

        <Row
          icon="document-text-outline"
          label="History"
          onPress={() => router.push("/(app)/profile/history")}
        />

        <Row
          icon="help-circle-outline"
          label="Help"
          onPress={() => alert("Help (todo)")}
        />

        <Row
          icon="log-out-outline"
          label="Log Out"
          isLast
          onPress={() =>
            Alert.alert(
              "Log Out",
              "Are you sure you want to log out?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log Out",
                  style: "destructive",
                  onPress: async () => {
                    await supabase.auth.signOut();
                  router.replace("/(auth)/login");
                  },
                },
              ]
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "#111827" },

  profileCard: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 22, fontWeight: "900", color: colors.primaryDark },

  name: { fontSize: 22, fontWeight: "900", color: "#111827" },
  email: { marginTop: 4, fontSize: 16, fontWeight: "600", color: "#9CA3AF" },

  editBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },

  loadingRow: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: { fontSize: 14, fontWeight: "700", color: "#9CA3AF" },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: spacing.xl,
  },

  menu: {
    paddingHorizontal: spacing.xl,
    paddingTop: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  rowIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 20, fontWeight: "700", color: "#111827" },
  rowRight: { minWidth: 44, alignItems: "flex-end", justifyContent: "center" },
});
