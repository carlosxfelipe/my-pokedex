import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export function HeaderGradient() {
  const { dark } = useTheme();

  const colors: [string, string] = dark
    ? ["#F5A623", "#FFCB05"]
    : ["#CC0000", "#FF4444"];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  );
}
