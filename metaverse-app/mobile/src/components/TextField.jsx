import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export default function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  rightIcon,
  onRightIconPress,
  error,
}) {
  const [secure, setSecure] = useState(Boolean(secureTextEntry));

  const showEye = secureTextEntry;

  return (
    <View style={styles.wrap}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrap, error && styles.inputError]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.white50}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={showEye ? secure : false}
        />
        {showEye ? (
          <Pressable onPress={() => setSecure((p) => !p)} hitSlop={10}>
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.white70}
            />
          </Pressable>
        ) : rightIcon ? (
          <Pressable onPress={onRightIconPress} hitSlop={10}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.l },
  label: { color: colors.white70, marginBottom: spacing.s, fontSize: 13 },
  inputWrap: {
    height: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.strokeStrong,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  input: { flex: 1, color: colors.white, fontSize: 16 },
  inputError: { borderColor: colors.error },
  error: { marginTop: 6, color: colors.error, fontSize: 12 },
});
