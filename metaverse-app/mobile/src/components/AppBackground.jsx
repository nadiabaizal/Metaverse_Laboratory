import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export default function AppBackground({ children }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/bg.png")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={2}
      />
      <LinearGradient
        colors={["rgba(7,22,47,0.30)", "rgba(7,22,47,0.75)"]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgBottom },
});
