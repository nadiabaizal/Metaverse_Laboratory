import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { spacing } from "../../../../src/theme/spacing";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../../../src/lib/supabase";
import * as DocumentPicker from "expo-document-picker";

const PRIMARY = "#2D2A7B";

const TEMPLATE_URL =
  "https://hwmwaeknkpuxirspsdom.supabase.co/storage/v1/object/public/responsibility_letters/templates/Letter of Responsibility.docx";

function Stepper({ step = 2 }) {
  const activeIdx = Math.max(1, Math.min(3, step)) - 1;
  return (
    <View style={styles.stepperRow}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[
            styles.stepBar,
            i === activeIdx ? styles.stepBarActive : styles.stepBarInactive,
          ]}
        />
      ))}
    </View>
  );
}

export default function ToolBookingStep2Upload() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookingId = Array.isArray(params.booking_id)
    ? params.booking_id[0]
    : params.booking_id;
  const [pickedFile, setPickedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  /* ===================== DOWNLOAD TEMPLATE ===================== */
  const downloadTemplate = async () => {
    await WebBrowser.openBrowserAsync(TEMPLATE_URL);
  };

  /* ===================== PICK & UPLOAD PDF ===================== */
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const file = res.assets?.[0];
      if (!file) return;

      setUploading(true);
      setPickedFile(file);

      const fileName = `${params.booking_id}.pdf`;
      const filePath = `facility-bookings/${fileName}`;

      // 🔥 FORM DATA (AMAN DI iOS)
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: fileName,
        type: "application/pdf",
      });

      const { error: uploadError } = await supabase.storage
        .from("responsibility_letters")
        .upload(filePath, formData, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);
        Alert.alert("Upload failed");
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from("responsibility_letters")
        .getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setUploadedUrl(data.publicUrl);
      setUploading(false);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      Alert.alert("Error", "Failed to upload file");
      setUploading(false);
    }
  };


  /* ===================== SUBMIT ===================== */
  const onSubmit = async () => {
    if (!uploadedUrl) {
      Alert.alert("Required", "Please upload responsibility letter PDF");
      return;
    }

    if (!bookingId) {
      Alert.alert("Error", "Booking ID not found");
      return;
    }

    const { error } = await supabase
      .from("facility_bookings")
      .update({
        responsibility_letter_url: uploadedUrl,
      })
      .eq("id", bookingId); // 🔥 PASTI KENA ROW

    if (error) {
      console.error("UPDATE ERROR:", error);
      Alert.alert("Failed to save document");
      return;
    }

    router.replace({
      pathname: "/(app)/facility/[id]/success",
      params: { id: String(params.id) },
    });
  };


  /* ===================== UI (TIDAK DIUBAH) ===================== */
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>
          <Text style={styles.headerTitle}>Tool’s Booking</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <Stepper step={2} />

      <View style={{ paddingHorizontal: spacing.xl, flex: 1 }}>
        <Text style={styles.bigTitle}>Letter of Responsibility Upload</Text>

        <Pressable onPress={downloadTemplate} hitSlop={8}>
          <Text style={styles.linkText}>
            Download the letter of responsibility here!
          </Text>
        </Pressable>

        <Pressable style={styles.dropzone} onPress={pickFile}>
          <View style={styles.dropInner}>
            <View style={styles.fileIcon}>
              <Ionicons name="cloud-upload-outline" size={30} color={PRIMARY} />
            </View>

            <Text style={styles.dropTitle}>
              {pickedFile ? "File Selected" : "Drag & Drop Files Here!"}
            </Text>

            {pickedFile ? (
              <Text style={styles.fileName} numberOfLines={1}>
                {pickedFile.name}
              </Text>
            ) : (
              <>
                <Text style={styles.orText}>Or</Text>
                <Text style={styles.openText}>Open File Manager</Text>
              </>
            )}
          </View>
        </Pressable>
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          style={[
            styles.primaryBtn,
            (!uploadedUrl || uploading) && { opacity: 0.6 },
          ]}
          disabled={!uploadedUrl || uploading}
          onPress={onSubmit}
        >
          <Text style={styles.primaryBtnText}>
            {uploading ? "Uploading..." : "Submit"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ===================== STYLES (TIDAK DIUBAH) ===================== */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  safe: { backgroundColor: "#FFFFFF" },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.l,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40 },
  headerTitle: { fontSize: 26, fontWeight: "800" },

  stepperRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    gap: 10,
    paddingBottom: spacing.l,
  },
  stepBar: { flex: 1, height: 3, borderRadius: 999 },
  stepBarActive: { backgroundColor: "#9C86FF" },
  stepBarInactive: { backgroundColor: "#D1D5DB" },

  bigTitle: { marginTop: spacing.l, fontSize: 30, fontWeight: "900" },
  linkText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "800",
    color: "#3B82F6",
    textDecorationLine: "underline",
  },

  dropzone: {
    marginTop: spacing.xxl,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(156,134,255,0.6)",
    borderRadius: 24,
    padding: 18,
    height: 420,
    justifyContent: "center",
  },
  dropInner: { alignItems: "center" },
  fileIcon: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: "rgba(156,134,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.l,
  },
  dropTitle: { fontSize: 18, fontWeight: "900" },
  orText: { marginTop: 10, fontWeight: "800", color: "#9CA3AF" },
  openText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
  fileName: { marginTop: 10, fontWeight: "800", color: "#6B7280" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: 24,
  },
  primaryBtn: {
    height: 76,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 26, fontWeight: "900", color: "#FFFFFF" },
});
