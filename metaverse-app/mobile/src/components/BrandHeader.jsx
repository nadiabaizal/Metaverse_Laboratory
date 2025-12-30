import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { colors } from "../theme/colors";

export default function BrandHeader({
  title = "Welcome to",
  brand = "Metaverse Laboratory",
  subtitle,
  showWelcome = true,
}) {
  return (
    <View style={styles.wrap}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        contentFit="contain"
      />

      {showWelcome && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.brand}>{brand}</Text>

      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginBottom: 22 },
  logo: { width: 130, height: 130, marginBottom: 14 },

  title: { color: colors.white, fontSize: 22, fontWeight: "700" },
  brand: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    fontStyle: "italic",
    marginTop: 6,
  },
  subtitle: {
    color: colors.white70,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
});
