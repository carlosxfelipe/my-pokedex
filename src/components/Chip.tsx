import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@react-navigation/native";
import type { Theme as AppTheme } from "../themes";

export interface ChipProps {
  label: string;
  selected?: boolean;
  color?: string;
  onPress?: () => void;
}

export function Chip({ label, selected = false, color, onPress }: ChipProps) {
  const theme = useTheme() as AppTheme;

  // Usamos a cor recebida ou a cor primária do tema como fallback
  const fallbackColor = color || theme.colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: selected ? fallbackColor : theme.colors.card,
          borderColor: selected ? fallbackColor : "transparent",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[styles.text, { color: selected ? "#fff" : theme.colors.text }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999, // Arredondado perfeitamente (pill-shape) como no Material Design
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
