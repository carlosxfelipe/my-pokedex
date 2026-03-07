import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export function HeaderGradient() {
  return (
    <LinearGradient
      colors={["#CC0000", "#FF4444"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  );
}
