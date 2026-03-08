import { Platform, View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Icon } from "./Icon";
import { Text } from "./Text";
import type { Theme as AppTheme } from "../themes";

interface HeaderButtonProps {
  onPress: () => void;
  label?: string;
  icon?: string;
}

export function HeaderButton({
  onPress,
  label = "Voltar",
  icon = "arrow-left",
}: HeaderButtonProps) {
  const theme = useTheme() as AppTheme;
  const color = theme.dark ? "#FFFFFF" : "#000000";

  // Retorna nulo se não for Android, se você quiser controlar a exibição fora
  // Ou sempre renderiza mas com estilo Android.
  // Vou fazer ele renderizar o estilo Android que você pediu.
  if (Platform.OS !== "android") return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Icon
          type="MaterialCommunityIcons"
          name={icon as any}
          size={24}
          color={color}
        />
        {label && <Text style={[styles.label, { color }]}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    marginLeft: -8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});
