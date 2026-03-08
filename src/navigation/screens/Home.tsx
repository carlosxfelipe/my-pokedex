import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import { ThemedView } from "../../components/ThemedView";
import { Text } from "../../components/Text";
import { usePokedexStore } from "../../store/usePokedexStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import type { PokemonSummary } from "../../domain/entities/Pokemon";
import type { Theme as AppTheme } from "../../themes";
import { TYPE_COLORS, TYPE_LABELS_PT } from "../../utils/pokemonTypes";

function PokemonCard({
  pokemon,
  onPress,
}: {
  pokemon: PokemonSummary;
  onPress: () => void;
}) {
  const theme = useTheme() as AppTheme;
  const primaryType = pokemon.types[0];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[
          styles.cardBadge,
          { backgroundColor: TYPE_COLORS[primaryType] + "30" },
        ]}
      >
        {pokemon.spriteUrl ? (
          <Image
            source={{ uri: pokemon.spriteUrl }}
            style={styles.sprite}
            resizeMode="contain"
          />
        ) : (
          <View
            style={[styles.sprite, { backgroundColor: theme.colors.border }]}
          />
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNumber}>
          #{String(pokemon.id).padStart(3, "0")}
        </Text>
        <Text style={styles.cardName}>{pokemon.name}</Text>
        <View style={styles.typeTags}>
          {pokemon.types.map((type) => (
            <View
              key={type}
              style={[styles.typeTag, { backgroundColor: TYPE_COLORS[type] }]}
            >
              <Text style={styles.typeTagText}>{TYPE_LABELS_PT[type]}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

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
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  cardBadge: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 12,
  },
  sprite: {
    width: 96,
    height: 96,
  },
  cardInfo: {
    padding: 10,
    gap: 4,
  },
  cardNumber: {
    fontSize: 11,
    opacity: 0.5,
    fontWeight: "600",
  },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  typeTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },
  typeTag: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
  },
});
