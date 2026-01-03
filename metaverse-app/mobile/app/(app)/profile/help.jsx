import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { spacing } from "../../../src/theme/spacing";

const FAQS = [
  {
    q: "How do I book a tool?",
    a: "Go to Facility menu, choose a tool, then tap Book Now.",
  },
  {
    q: "Why can’t I book a tool?",
    a: "The tool may be fully booked or unavailable.",
  },
  {
    q: "How do I register for an event?",
    a: "Open Events, select an event, and tap Register.",
  },
  {
    q: "Who can I contact for help?",
    a: "You can contact Metaverse Lab ITB via WhatsApp or email from the Help menu.",
  },
];

export default function FAQScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} />
        </Pressable>
        <Text style={styles.title}>FAQ</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.list}>
        {FAQS.map((f, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.q}>{f.q}</Text>
            <Text style={styles.a}>{f.a}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
  },
  backBtn: { width: 40 },
  title: { fontSize: 26, fontWeight: "900" },

  list: { padding: spacing.xl },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  q: { fontSize: 18, fontWeight: "900" },
  a: { marginTop: 8, fontSize: 16, color: "#6B7280", fontWeight: "600" },
});
