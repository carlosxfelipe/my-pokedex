import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import { ThemedView } from "../../components/ThemedView";
import { Text } from "../../components/Text";
import { usePokedexStore } from "../../store/usePokedexStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import type { Theme as AppTheme } from "../../themes";
import { PokemonCard } from "../../components/PokemonCard";
import { isCatchable } from "../../utils/versionExclusives";

export function Home() {
  const navigation = useNavigation<any>();
  const theme = useTheme() as AppTheme;
  const { list, listLoading, listError, loadList } = usePokedexStore();
  const { language, gameVersion } = useSettingsStore();

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (list.length === 0) {
      loadList(language);
    }
  }, [language]);

  const filtered = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        String(p.id).padStart(3, "0").includes(q),
    );
  }, [list, query]);

  if (listLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando Pokédex…</Text>
      </ThemedView>
    );
  }

  if (listError) {
    return (
      <ThemedView style={styles.centered}>
        <Text>{listError}</Text>
        <TouchableOpacity onPress={() => loadList(language)}>
          <Text style={{ color: theme.colors.primary }}>Tentar novamente</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            isCatchable={isCatchable(item.id, gameVersion)}
            onPress={() => {
              navigation.navigate("PokemonDetail", { id: item.id });
            }}
          />
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    marginTop: 8,
    opacity: 0.6,
  },
  list: {
    padding: 12,
    gap: 12,
  },
  row: {
    gap: 12,
  },
});
