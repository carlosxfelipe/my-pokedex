import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "@react-navigation/native";

export function ThemedView(props: ViewProps) {
  const { colors } = useTheme();
  const backgroundColor = colors.background;
  return <View {...props} style={[props.style, { backgroundColor }]} />;
}
