import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import { ThemedView } from "../../components/ThemedView";
import { Text } from "../../components/Text";
import { usePokedexStore } from "../../store/usePokedexStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import type { Theme as AppTheme } from "../../themes";
import type { Move } from "../../domain/entities/Move";
import {
  TYPE_COLORS_LIGHT,
  TYPE_COLORS_DARK,
  TYPE_LABELS_PT,
} from "../../utils/pokemonTypes";

function MoveRow({ move }: { move: Move }) {
  const theme = useTheme() as AppTheme;
  const TYPE_COLORS = theme.dark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT;
  return (
    <View style={[styles.moveRow, { borderBottomColor: theme.colors.border }]}>
      <Text style={styles.moveLevel}>
        {move.level === 0 ? "TM" : `Lv ${String(move.level).padStart(2, "0")}`}
      </Text>
      <View
        style={[styles.moveType, { backgroundColor: TYPE_COLORS[move.type] }]}
      >
        <Text style={styles.moveTypeText}>{TYPE_LABELS_PT[move.type]}</Text>
      </View>
      <Text style={styles.moveName}>{move.name}</Text>
      <Text style={styles.moveStat}>{move.power ?? "—"}</Text>
      <Text style={styles.moveStat}>
        {move.accuracy ? `${move.accuracy}%` : "—"}
      </Text>
    </View>
  );
}

export function PokemonDetail() {
  const route = useRoute<any>();
  const { id } = route.params as { id: number };
  const theme = useTheme() as AppTheme;
  const TYPE_COLORS = theme.dark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT;
  const { selectedPokemon, detailLoading, detailError, loadDetail } =
    usePokedexStore();
  const { gameVersion, language } = useSettingsStore();

  useEffect(() => {
    loadDetail(id, gameVersion, language);
  }, [id, gameVersion, language]);

  if (detailLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ThemedView>
    );
  }

  if (detailError || !selectedPokemon) {
    return (
      <ThemedView style={styles.centered}>
        <Text>{detailError ?? "Pokémon não encontrado"}</Text>
      </ThemedView>
    );
  }

  const p = selectedPokemon;
  const primaryType = p.types[0];

  return (
    <ThemedView style={styles.container}>
      {/* Header colorido */}
      <View
        style={[
          styles.hero,
          { backgroundColor: TYPE_COLORS[primaryType] + "40" },
        ]}
      >
        {p.spriteUrl && (
          <Image
            source={{ uri: p.spriteUrl }}
            style={styles.heroSprite}
            resizeMode="contain"
          />
        )}
        <Text style={styles.heroNumber}>#{String(p.id).padStart(3, "0")}</Text>
        <Text style={styles.heroName}>{p.name}</Text>
        <View style={styles.heroTypes}>
          {p.types.map((type) => (
            <View
              key={type}
              style={[styles.typeTag, { backgroundColor: TYPE_COLORS[type] }]}
            >
              <Text style={styles.typeTagText}>{TYPE_LABELS_PT[type]}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Evoluções */}
        {p.evolutionChain.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evoluções</Text>
            <View style={styles.evoChain}>
              {p.evolutionChain.map((evo, i) => (
                <React.Fragment key={evo.pokemonId}>
                  {i > 0 && (
                    <View style={styles.evoArrowContainer}>
                      <Text style={styles.evoArrow}>
                        {evo.minLevel
                          ? `Lv ${evo.minLevel}`
                          : (evo.item ?? evo.trigger)}
                        {"\n→"}
                      </Text>
                    </View>
                  )}
                  <View style={styles.evoItem}>
                    {evo.spriteUrl ? (
                      <Image
                        source={{ uri: evo.spriteUrl }}
                        style={styles.evoSprite}
                        resizeMode="contain"
                      />
                    ) : null}
                    <Text style={styles.evoName} numberOfLines={1}>
                      {evo.pokemonName}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Golpes — FireRed & LeafGreen</Text>
          {/* Header da tabela */}
          <View
            style={[styles.moveRow, { borderBottomColor: theme.colors.border }]}
          >
            <Text style={[styles.moveLevel, styles.tableHeader]}>Lv</Text>
            <Text
              style={[
                styles.moveType,
                styles.tableHeader,
                { backgroundColor: "transparent" },
              ]}
            >
              Tipo
            </Text>
            <Text style={[styles.moveName, styles.tableHeader]}>Nome</Text>
            <Text style={[styles.moveStat, styles.tableHeader]}>Pow</Text>
            <Text style={[styles.moveStat, styles.tableHeader]}>Acc</Text>
          </View>
          {p.moves.map((move, i) => (
            <MoveRow key={`${move.name}-${i}`} move={move} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  hero: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  heroSprite: { width: 160, height: 160 },
  heroNumber: { fontSize: 13, opacity: 0.5, fontWeight: "600" },
  heroName: {
    fontSize: 28,
    fontWeight: "800",
    textTransform: "capitalize",
    paddingVertical: 4,
  },
  heroTypes: { flexDirection: "row", gap: 8 },
  typeTag: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeTagText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    textTransform: "capitalize",
  },
  content: { padding: 16, gap: 24, paddingBottom: 40 },
  section: { gap: 10 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    opacity: 0.5,
  },
  evoChain: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  evoItem: { alignItems: "center", gap: 4, minWidth: 72 },
  evoArrowContainer: { paddingBottom: 24, paddingHorizontal: 4 },
  evoArrow: { fontSize: 11, textAlign: "center", opacity: 0.6 },
  evoSprite: { width: 72, height: 72 },
  evoName: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
    textAlign: "center",
  },
  moveRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    gap: 8,
  },
  tableHeader: { opacity: 0.5, fontWeight: "700", fontSize: 11 },
  moveLevel: { width: 36, fontSize: 12, fontWeight: "600" },
  moveType: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 56,
    alignItems: "center",
  },
  moveTypeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    textTransform: "capitalize",
  },
  moveName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  moveStat: { width: 36, fontSize: 12, textAlign: "right", opacity: 0.7 },
});
