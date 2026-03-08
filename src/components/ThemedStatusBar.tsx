import React from "react";
import { StatusBar, useColorScheme } from "react-native";

interface Props {
  inverted?: boolean;
}

export function ThemedStatusBar({ inverted }: Props) {
  const colorScheme = useColorScheme();

  const standardStyle =
    colorScheme === "dark" ? "dark-content" : "light-content";
  const invertedStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";

  return (
    <StatusBar
      barStyle={inverted ? invertedStyle : standardStyle}
      backgroundColor="transparent"
      translucent
    />
  );
}
