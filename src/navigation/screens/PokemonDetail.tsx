import React, { useEffect, useMemo } from "react";
import {
  Image,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "../../components/ThemedView";
import { ThemedStatusBar } from "../../components/ThemedStatusBar";
import { Text } from "../../components/Text";
import { ContrastText } from "../../components/ContrastText";
import { Icon } from "../../components/Icon";
import { PokemonDetailSkeleton } from "../../components/PokemonDetailSkeleton";
import { usePokedexStore } from "../../store/usePokedexStore";
import { useSettingsStore } from "../../store/useSettingsStore";
import type { Theme as AppTheme } from "../../themes";
import type { Move } from "../../domain/entities/Move";
import {
  TYPE_COLORS_LIGHT,
  TYPE_COLORS_DARK,
  TYPE_LABELS_PT,
} from "../../utils/pokemonTypes";
import { capitalize } from "../../utils/stringUtils";

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
        <ContrastText
          backgroundColor={TYPE_COLORS[move.type]}
          style={styles.moveTypeText}
        >
          {TYPE_LABELS_PT[move.type]}
        </ContrastText>
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
  const navigation = useNavigation<any>();
  const { id } = route.params as { id: number };
  const insets = useSafeAreaInsets();
  const detailKey = String(id);
  const theme = useTheme() as AppTheme;
  const TYPE_COLORS = theme.dark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT;
  const { detailById, detailLoadingById, detailErrorById, loadDetail, list } =
    usePokedexStore();
  const { gameVersion, language, showAllGenerations } = useSettingsStore();

  const selectedPokemon = detailById[detailKey] ?? null;
  const detailLoading = detailLoadingById[detailKey] ?? false;
  const detailError = detailErrorById[detailKey] ?? null;

  useEffect(() => {
    loadDetail(id, gameVersion, language);
  }, [id, gameVersion, language]);

  const filteredEvoChain = useMemo(() => {
    if (!selectedPokemon) return [];
    if (showAllGenerations) return selectedPokemon.evolutionChain;
    // Se o modo "Todas as Gerações" estiver desligado, filtra evoluções fora do limite 386 (FR/LG)
    return selectedPokemon.evolutionChain.filter(
      (evo) => evo.fromId <= 386 && evo.toId <= 386,
    );
  }, [selectedPokemon, showAllGenerations]);

  if (detailLoading) {
    return <PokemonDetailSkeleton />;
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
  const androidHeaderOffset =
    Platform.OS === "android"
      ? Math.max(StatusBar.currentHeight ?? 0, insets.top) + 56
      : 0;

  return (
    <ThemedView style={styles.container}>
      <ThemedStatusBar />
      {/* Header colorido */}
      <LinearGradient
        colors={[TYPE_COLORS[primaryType] + "80", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.hero,
          Platform.OS === "android" ? { marginTop: androidHeaderOffset } : null,
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
              <ContrastText
                backgroundColor={TYPE_COLORS[type]}
                style={styles.typeTagText}
              >
                {TYPE_LABELS_PT[type]}
              </ContrastText>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Evoluções */}
        {filteredEvoChain.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evoluções</Text>
            <View style={styles.evoContainer}>
              {filteredEvoChain.map((evo, idx) => (
                <View
                  key={`${evo.fromId}-${evo.toId}-${idx}`}
                  style={styles.evoLinkRow}
                >
                  {/* ORIGEM */}
                  <TouchableOpacity
                    style={styles.evoMember}
                    activeOpacity={0.7}
                    onPress={() => {
                      const fromTypes =
                        detailById[String(evo.fromId)]?.types ??
                        list.find((p) => p.id === evo.fromId)?.types;
                      navigation.push("PokemonDetail", {
                        id: evo.fromId,
                        name: capitalize(evo.fromName),
                        color: fromTypes
                          ? TYPE_COLORS[fromTypes[0]]
                          : undefined,
                      });
                    }}
                  >
                    {evo.fromSpriteUrl ? (
                      <Image
                        source={{ uri: evo.fromSpriteUrl }}
                        style={styles.evoSprite}
                        resizeMode="contain"
                      />
                    ) : null}
                    <Text style={styles.evoName} numberOfLines={1}>
                      {evo.fromName}
                    </Text>
                  </TouchableOpacity>

                  {/* CONEXÃO / MÉTODO */}
                  <View style={styles.evoConnection}>
                    <Text style={styles.evoMethodText}>
                      {evo.minLevel
                        ? `Lv ${evo.minLevel}`
                        : evo.item
                          ? evo.item.replace(/-/g, " ")
                          : evo.trigger === "trade"
                            ? "Troca"
                            : "→"}
                    </Text>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="arrow-right"
                      size={20}
                      color={theme.colors.text}
                      style={{ opacity: 0.2 }}
                    />
                  </View>

                  {/* DESTINO */}
                  <TouchableOpacity
                    style={styles.evoMember}
                    activeOpacity={0.7}
                    onPress={() => {
                      const toTypes =
                        detailById[String(evo.toId)]?.types ??
                        list.find((p) => p.id === evo.toId)?.types;
                      navigation.push("PokemonDetail", {
                        id: evo.toId,
                        name: capitalize(evo.toName),
                        color: toTypes ? TYPE_COLORS[toTypes[0]] : undefined,
                      });
                    }}
                  >
                    {evo.toSpriteUrl ? (
                      <Image
                        source={{ uri: evo.toSpriteUrl }}
                        style={styles.evoSprite}
                        resizeMode="contain"
                      />
                    ) : null}
                    <Text style={styles.evoName} numberOfLines={1}>
                      {evo.toName}
                    </Text>
                  </TouchableOpacity>
                </View>
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
  evoContainer: {
    paddingTop: 8,
  },
  evoLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  evoMember: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  evoConnection: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 8,
    minWidth: 80,
  },
  evoMethodText: {
    fontSize: 10,
    fontWeight: "800",
    opacity: 0.4,
    textTransform: "uppercase",
    textAlign: "center",
  },
  evoSprite: {
    width: 64,
    height: 64,
  },
  evoName: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
    opacity: 0.8,
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
