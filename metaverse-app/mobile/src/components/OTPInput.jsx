import React, { useEffect, useMemo, useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function OTPInput({ value, onChange, length = 4 }) {
  const refs = useRef([]);
  const digits = useMemo(() => {
    const arr = (value || "").split("").slice(0, length);
    while (arr.length < length) arr.push("");
    return arr;
  }, [value, length]);

  useEffect(() => {
    // focus first empty
    const i = digits.findIndex((d) => !d);
    if (i >= 0) refs.current[i]?.focus?.();
  }, []); // once

  return (
    <View style={styles.row}>
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(r) => (refs.current[i] = r)}
          value={d}
          onChangeText={(t) => {
            const c = (t || "").replace(/\D/g, "").slice(-1);
            const next = digits.slice();
            next[i] = c;
            onChange(next.join(""));
            if (c && i < length - 1) refs.current[i + 1]?.focus?.();
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === "Backspace" && !digits[i] && i > 0) {
              refs.current[i - 1]?.focus?.();
            }
          }}
          keyboardType="number-pad"
          maxLength={1}
          style={styles.box}
          placeholderTextColor={colors.white50}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 18, justifyContent: "center" },
  box: {
    width: 72,
    height: 72,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.strokeStrong,
    color: colors.white,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.10)",
  },
});
