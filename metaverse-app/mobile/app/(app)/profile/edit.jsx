import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { api } from "../../../src/lib/api";
import { colors } from "../../../src/theme/colors";
import { spacing } from "../../../src/theme/spacing";

function getInitials(fullNameOrEmail) {
  if (!fullNameOrEmail) return "U";
  const s = String(fullNameOrEmail).trim();
  if (!s) return "U";
  if (s.includes("@")) return s.slice(0, 2).toUpperCase();
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  rightIcon,
  onPressRight,
  editable = true,
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.inputRow, !editable && { opacity: 0.7 }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType={keyboardType}
          editable={editable}
        />

        {rightIcon ? (
          <Pressable onPress={onPressRight} hitSlop={10} style={styles.rightIconBtn}>
            <Ionicons name={rightIcon} size={22} color="#9CA3AF" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState(null);

  // fields
  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // biasanya email dari auth (opsional: read-only)
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");

  // ✅ fetch data hasil register
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/me");
        const user = res.data?.user || null;
        if (!mounted) return;

        setMe(user);

        // sesuaikan key profile kamu yang dipakai saat register
        const p = user?.profile || {};
        setNik(p?.nik ? String(p.nik) : "");
        setName(p?.fullName || p?.name || "");
        setEmail(user?.email || "");
        setPhone(p?.phoneNumber || p?.phone || "");
        setBirthDate(p?.birthDate || "");
        setAddress(p?.address || p?.alamat || "");
      } catch (e) {
        console.log("GET /me failed:", e?.response?.status, e?.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const initials = useMemo(() => getInitials(name || email), [name, email]);

  const onPickBirthDate = () => {
    Alert.alert("Todo", "Open date picker (belum dipasang)");
  };

  const onSave = async () => {
    // validasi minimal (boleh kamu tambah)
    if (!name.trim()) {
      Alert.alert("Validation", "Name tidak boleh kosong.");
      return;
    }

    setSaving(true);
    try {
      // ✅ samakan dengan flow register kamu: POST /me/profile
      // payload ini disesuaikan supaya match dengan backend kamu
      const payload = {
        nik,
        fullName: name,
        phoneNumber: phone,
        birthDate,
        address,
      };

      await api.post("/me/profile", payload);

      Alert.alert("Success", "Profile berhasil disimpan.");
      router.back();
    } catch (e) {
      console.log("POST /me/profile failed:", e?.response?.status, e?.response?.data || e?.message);
      Alert.alert("Error", "Gagal menyimpan profile. Coba lagi ya.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <Pressable onPress={() => Alert.alert("Todo", "Change photo belum dibuat")} hitSlop={10}>
              <Text style={styles.changePhoto}>Change Profile Photo</Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Loading data...</Text>
            </View>
          ) : null}

          {/* Form */}
          <Field label="NIK" value={nik} onChangeText={setNik} placeholder="NIK" keyboardType="number-pad" />
          <Field label="Name" value={name} onChangeText={setName} placeholder="Name" />

          {/* Email biasanya dari auth -> opsional: read-only supaya aman */}
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            editable={false}
          />

          <Field
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+62XX-XXXX-XXXX"
            keyboardType="phone-pad"
          />

          <Field
            label="Birth Date"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="Birth Date"
            rightIcon="calendar-outline"
            onPressRight={onPickBirthDate}
          />

          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Alamat Lengkap</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Alamat"
              placeholderTextColor="#9CA3AF"
              style={[styles.input, styles.textArea]}
              multiline
            />
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Save button fixed bottom */}
        <View style={styles.saveBar}>
          <Pressable
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={onSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>Simpan</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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

  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 20,
  },

  avatarSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 18,
    gap: 14,
  },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.primaryDark,
  },
  changePhoto: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.primaryDark,
  },

  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  loadingText: { fontSize: 14, fontWeight: "700", color: "#9CA3AF" },

  fieldWrap: {
    marginTop: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderRadius: 6,
    paddingHorizontal: 14,
    height: 58,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  rightIconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  textArea: {
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingTop: 14,
    minHeight: 90,
    textAlignVertical: "top",
  },

  saveBar: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 18,
    paddingTop: 10,
    backgroundColor: "#FFFFFF",
  },
  saveBtn: {
    height: 70,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
