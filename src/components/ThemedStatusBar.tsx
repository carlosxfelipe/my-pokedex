import React from "react";
import { StatusBar, useColorScheme } from "react-native";

export function ThemedStatusBar() {
  const colorScheme = useColorScheme();
  return (
    <StatusBar
      barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
      backgroundColor="transparent"
      translucent
    />
  );
}
