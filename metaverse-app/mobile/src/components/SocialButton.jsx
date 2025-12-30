import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function SocialButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.box}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.strokeStrong,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.10)",
  },
});
