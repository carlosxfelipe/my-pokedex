import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ThemedView } from "../../components/ThemedView";
import { Text } from "../../components/Text";
import { useSettingsStore } from "../../store/useSettingsStore";
import type { Theme as AppTheme } from "../../themes";
import type {
  GameVersion,
  DataLanguage,
} from "../../domain/value-objects/GameVersion";

function OptionGroup<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  const theme = useTheme() as AppTheme;
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.pills}>
        {options.map((opt) => {
          const active = opt.value === selected;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.pill,
                {
                  backgroundColor: active
                    ? theme.colors.primary
                    : theme.colors.card,
                  borderColor: theme.colors.primary,
                },
              ]}
              onPress={() => onSelect(opt.value)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? "#fff" : theme.colors.text },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function Settings() {
  const { gameVersion, language, setGameVersion, setLanguage } =
    useSettingsStore();

  return (
    <ThemedView style={styles.container}>
      <OptionGroup<GameVersion>
        label="Versão do jogo"
        selected={gameVersion}
        onSelect={setGameVersion}
        options={[
          { value: "firered", label: "🔥 FireRed" },
          { value: "leafgreen", label: "🍃 LeafGreen" },
        ]}
      />

      <OptionGroup<DataLanguage>
        label="Idioma dos dados"
        selected={language}
        onSelect={setLanguage}
        options={[
          { value: "en", label: "🇺🇸 English" },
          { value: "es", label: "🇪🇸 Español" },
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 32,
  },
  group: {
    gap: 12,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    opacity: 0.5,
  },
  pills: {
    flexDirection: "row",
    gap: 10,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
