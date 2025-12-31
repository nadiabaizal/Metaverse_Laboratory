import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { spacing } from "../../../../src/theme/spacing";
import { getFacilityById } from "../../../../src/data/mockFacilities";

const PRIMARY = "#2D2A7B";

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
  const tool = useMemo(() => getFacilityById(String(params.id)), [params.id]);
  const [pickedFile, setPickedFile] = useState(null);

  const pickFile = async () => {
    try {
      // Optional dependency:
      // npx expo install expo-document-picker
      const DocumentPicker = await import("expo-document-picker");
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;
      const file = res.assets?.[0];
      if (!file) return;
      setPickedFile(file);
    } catch (e) {
      Alert.alert(
        "File picker belum tersedia",
        "Untuk memilih file, install expo-document-picker lalu jalankan ulang app.\n\nSementara ini kamu bisa lanjut dummy submit."
      );
    }
  };

  const onSubmit = () => {
    router.replace({ pathname: "/(app)/facility/[id]/success", params: { id: String(params.id) } });
  };

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
        <Pressable
          onPress={() =>
            Alert.alert(
              "Download",
              "Link download masih dummy. Nanti bisa diarahkan ke file dari server/database."
            )
          }
          hitSlop={8}
        >
          <Text style={styles.linkText}>Download the letter of responsibility here!</Text>
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
                {pickedFile.name || pickedFile.uri}
              </Text>
            ) : (
              <>
                <Text style={styles.orText}>Or</Text>
                <Text style={styles.openText}>Open File Manager</Text>
              </>
            )}
          </View>
        </Pressable>

        {!!tool && (
          <Text style={styles.hint}>
            Upload untuk: <Text style={{ fontWeight: "900" }}>{tool.title}</Text>
          </Text>
        )}
      </View>

      <View style={styles.bottomBar}>
        <Pressable style={styles.primaryBtn} onPress={onSubmit}>
          <Text style={styles.primaryBtnText}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.2,
  },

  stepperRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    gap: 10,
    paddingBottom: spacing.l,
  },
  stepBar: { flex: 1, height: 3, borderRadius: 999 },
  stepBarActive: { backgroundColor: "#9C86FF" },
  stepBarInactive: { backgroundColor: "#D1D5DB" },

  bigTitle: { marginTop: spacing.l, fontSize: 30, fontWeight: "900", color: "#0F172A" },
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
  dropTitle: { fontSize: 18, fontWeight: "900", color: "#111827" },
  orText: { marginTop: 10, color: "#9CA3AF", fontWeight: "800" },
  openText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
  fileName: { marginTop: 10, maxWidth: "92%", fontWeight: "800", color: "#6B7280" },

  hint: { marginTop: spacing.xl, color: "#6B7280", fontWeight: "700" },

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
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  primaryBtnText: { fontSize: 26, fontWeight: "900", color: "#FFFFFF" },
});
