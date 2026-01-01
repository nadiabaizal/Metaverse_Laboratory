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
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../../../src/lib/supabase";
import { colors } from "../../../src/theme/colors";
import { spacing } from "../../../src/theme/spacing";

/* ================= utils ================= */
function getInitials(v) {
  if (!v) return "U";
  const s = String(v).trim();
  if (s.includes("@")) return s.slice(0, 2).toUpperCase();
  const p = s.split(/\s+/);
  return p.length === 1
    ? p[0].slice(0, 2).toUpperCase()
    : (p[0][0] + p[p.length - 1][0]).toUpperCase();
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
      <View style={[styles.inputRow, !editable && { opacity: 0.6 }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          editable={editable}
        />
        {rightIcon && (
          <Pressable onPress={onPressRight} style={styles.rightIconBtn}>
            <Ionicons name={rightIcon} size={22} color="#9CA3AF" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

/* ================= screen ================= */
export default function EditProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nik, setNik] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);

  /* ========= LOAD PROFILE ========= */
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) throw new Error("Session expired");

        const { data, error } = await supabase
          .from("profiles")
          .select(
            "nik,name,email,phone_num,birth_date,address,avatar_url"
          )
          .eq("id", auth.user.id)
          .single();

        if (error) throw error;
        if (!mounted) return;

        setNik(data?.nik ?? "");
        setName(data?.name ?? "");
        setEmail(data?.email ?? auth.user.email ?? "");
        setPhone(data?.phone_num ?? "");
        setBirthDate(data?.birth_date ?? "");
        setAddress(data?.address ?? "");
        setAvatarUrl(data?.avatar_url ?? null);
      } catch (e) {
        Alert.alert("Error", "Gagal memuat profile");
        router.replace("/(auth)/login");
      } finally {
        mounted && setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  const initials = useMemo(() => getInitials(name || email), [name, email]);

  /* ========= SAVE PROFILE ========= */
  const onSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validasi", "Nama wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error("Session expired");

      const { error } = await supabase.from("profiles").upsert(
        {
          id: auth.user.id,
          nik,
          name,
          email,
          phone_num: phone,
          birth_date: birthDate || null,
          address,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (error) throw error;

      Alert.alert("Success", "Profile berhasil disimpan", {
        onPress: () => router.back(),
      });
    } catch (e) {
      Alert.alert("Error", "Gagal menyimpan profile");
    } finally {
      setSaving(false);
    }
  };

  /* ========= CHANGE AVATAR ========= */
  const onChangePhoto = async () => {
  try {
    // 1. Permission
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission dibutuhkan", "Akses galeri diperlukan");
      return;
    }

    // 2. PICK IMAGE (TANPA mediaTypes)
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    // support SDK lama & baru
    if (result.cancelled || result.canceled) return;

    const asset = result.assets ? result.assets[0] : result;
    if (!asset?.base64) {
      Alert.alert("Error", "Gagal membaca file gambar");
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return;

    const fileExt = asset.uri.split(".").pop() || "jpg";
    const filePath = `${auth.user.id}.${fileExt}`;

    // 3. base64 → Uint8Array (ANTI 0 BYTE)
    const binary = Uint8Array.from(
      atob(asset.base64),
      (c) => c.charCodeAt(0)
    );

    // 4. Upload ke Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(filePath, binary, {
        upsert: true,
        contentType: "image/jpeg",
        cacheControl: "3600",
        contentDisposition: "inline",
      });

    if (uploadErr) {
      Alert.alert("Upload gagal", uploadErr.message);
      return;
    }

    // 5. Public URL
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // 6. Simpan ke table profiles
    await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", auth.user.id);

    // 7. Refresh avatar
    setAvatarUrl(data.publicUrl + "?t=" + Date.now());
  } catch (e) {
    console.log("CHANGE PHOTO ERROR:", e);
    Alert.alert("Error", "Terjadi kesalahan saat ganti foto");
  }
};

  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <Pressable onPress={onChangePhoto}>
              <Text style={styles.changePhoto}>Change Profile Photo</Text>
            </Pressable>
          </View>

          {loading && <ActivityIndicator />}

          <Field label="NIK" value={nik} onChangeText={setNik} />
          <Field label="Name" value={name} onChangeText={setName} />
          <Field label="Email" value={email} editable={false} />
          <Field label="Phone Number" value={phone} onChangeText={setPhone} />
          <Field label="Birth Date" value={birthDate} onChangeText={setBirthDate} />
          <Field label="Alamat Lengkap" value={address} onChangeText={setAddress} />
        </ScrollView>

        <View style={styles.saveBar}>
          <Pressable style={styles.saveBtn} onPress={onSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Simpan</Text>}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ================= styles ================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 28, fontWeight: "900" },

  scroll: { paddingHorizontal: spacing.xl },
  avatarSection: { alignItems: "center", marginVertical: 16 },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: { width: "100%", height: "100%", borderRadius: 55 },
  avatarText: { fontSize: 34, fontWeight: "900", color: colors.primaryDark },
  changePhoto: { marginTop: 12, fontSize: 18, fontWeight: "800", color: colors.primaryDark },

  fieldWrap: { marginTop: 14 },
  label: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderRadius: 6,
    paddingHorizontal: 14,
    height: 58,
  },
  input: { flex: 1, fontSize: 18 },
  rightIconBtn: { width: 44, justifyContent: "center", alignItems: "center" },
  textArea: { minHeight: 90, textAlignVertical: "top" },

  saveBar: { padding: spacing.xl },
  saveBtn: {
    height: 70,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 26, fontWeight: "900", color: "#fff" },
});
