import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { useTheme } from "@react-navigation/native";

export function ThemedScrollView(props: ScrollViewProps) {
  const { colors } = useTheme();
  const backgroundColor = colors.background;
  return <ScrollView {...props} style={[props.style, { backgroundColor }]} />;
}
