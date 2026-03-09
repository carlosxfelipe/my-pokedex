import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

type Props = {
  color?: string;
};

export function HeaderGradient({ color }: Props) {
  const { dark } = useTheme();

  const colors: [string, string] = color
    ? [color, color]
    : dark
      ? ["#F5A623", "#FFCB05"]
      : ["#CC0000", "#FF4444"];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    />
  );
}
