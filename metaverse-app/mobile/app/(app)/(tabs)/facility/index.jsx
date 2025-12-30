import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Stack } from "expo-router";

const TAB_BAR_HEIGHT = 25; // ⬅️ sesuaikan dengan CustomTabBar kamu

const FACILITIES = [
  {
    id: "1",
    title: "High Performance PC",
    description:
      "Powerful PC built for high-end VR development and rendering complex scenes",
    image: "https://i.imgur.com/zM0kX8L.png",
    available: 3,
  },
  {
    id: "2",
    title: "Oculus Quest 2",
    description:
      "A standalone VR headset with 6DOF tracking for a fully immersive experience",
    image: "https://i.imgur.com/zM0kX8L.png",
    available: 4, 
  },
  {
    id: "3",
    title: "Oculus Quest 2",
    description:
      "A standalone VR headset with 6DOF tracking for a fully immersive experience",
    image: "https://i.imgur.com/zM0kX8L.png",
    available: 4,
  },
  {
    id: "4",
    title: "Oculus Quest 2",
    description:
      "A standalone VR headset with 6DOF tracking for a fully immersive experience",
    image: "https://i.imgur.com/zM0kX8L.png",
    available: 4,
  },
  {    
    id: "5",
    title: "Oculus Quest 2",
    description:
      "A standalone VR headset with 6DOF tracking for a fully immersive experience",
    image: "https://i.imgur.com/zM0kX8L.png",
    available: 4,
  },
];

export default function FacilityScreen() {
  const [activeTab, setActiveTab] = useState("Available");
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <Stack.Screen
        options={{
          title: "Facility",
          headerTitleAlign: "center",
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        content
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: TAB_BAR_HEIGHT + 28, // ⬅️ PENTING
        }}
      >
        {/* SEGMENT */}
        <View style={styles.segment}>
          {["Available", "Latest Added", "Oldest Added"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.segmentItem,
                activeTab === item && styles.segmentActive,
              ]}
              onPress={() => setActiveTab(item)}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeTab === item && styles.segmentTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search Tools..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* CARDS */}
        {FACILITIES.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>

              <Text style={styles.available}>
                {item.available} more left
              </Text>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.detailBtn}>
                  <Text style={styles.detailText}>Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY = "#3B2F6B";

const styles = StyleSheet.create({
  segment: {
    flexDirection: "row",
    backgroundColor: "#EEF2F7",
    borderRadius: 24,
    padding: 4,
    marginVertical: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: PRIMARY,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },

  searchBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchInput: {
    height: 44,
    fontSize: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    marginBottom: 20,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  available: {
    fontSize: 12,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 10,
  },

  cardActions: {
    flexDirection: "row",
    gap: 10,
  },
  detailBtn: {
    flex: 1,
    borderWidth: 1.2,
    borderColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    fontWeight: "700",
    color: PRIMARY,
  },
  bookBtn: {
    flex: 1,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  bookText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
