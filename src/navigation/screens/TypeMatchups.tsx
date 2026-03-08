import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ThemedScrollView } from "../../components/ThemedScrollView";
import { Text } from "../../components/Text";
import { Chip } from "../../components/Chip";
import { Icon } from "../../components/Icon";
import {
  OFFENSIVE_MATCHUPS,
  getDefensiveMatchups,
} from "../../utils/typeMatchups";
import {
  TYPE_LABELS_PT,
  TYPE_COLORS_LIGHT,
  TYPE_COLORS_DARK,
} from "../../utils/pokemonTypes";
import type { PokemonType } from "../../domain/value-objects/PokemonType";
import type { Theme as AppTheme } from "../../themes";

export function TypeMatchups() {
  const [selectedType, setSelectedType] = useState<PokemonType>("fire");
  const theme = useTheme() as AppTheme;

  const TYPE_COLORS = theme.dark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT;
  const typeEntries = Object.entries(TYPE_LABELS_PT) as [PokemonType, string][];

  // Cálculos de combate para o tipo selecionado
  const offensive = OFFENSIVE_MATCHUPS[selectedType];
  const defensive = getDefensiveMatchups(selectedType);

  const renderChipList = (
    types: PokemonType[],
    emptyMessage: string,
    isOffensiveHighlight = true,
  ) => {
    if (types.length === 0) {
      return <Text style={styles.emptyText}>{emptyMessage}</Text>;
    }
    return (
      <View style={styles.chipRow}>
        {types.map((t) => (
          <Chip
            key={t}
            label={TYPE_LABELS_PT[t]}
            color={TYPE_COLORS[t]}
            selected={isOffensiveHighlight}
          />
        ))}
      </View>
    );
  };

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      {/* SEÇÃO PRINCIPAL DE ESCOLHA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecione um Tipo Foco</Text>
        <View style={styles.typesGrid}>
          {typeEntries.map(([key, label]) => {
            const isSelected = key === selectedType;
            return (
              <Chip
                key={key}
                label={label}
                selected={isSelected}
                color={TYPE_COLORS[key]}
                onPress={() => setSelectedType(key)}
              />
            );
          })}
        </View>
      </View>

      <View style={[styles.mainCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.headerIndicator}>
          <View
            style={[
              styles.indicatorPill,
              { backgroundColor: TYPE_COLORS[selectedType] },
            ]}
          />
          <Text style={styles.indicatorText}>
            ANÁLISE DE TIPO: {TYPE_LABELS_PT[selectedType].toUpperCase()}
          </Text>
        </View>

        {/* SEÇÃO OFENSIVA */}
        <View style={styles.combatSection}>
          <View style={styles.combatHeader}>
            <Icon
              type="MaterialCommunityIcons"
              name="sword-cross"
              size={18}
              color={theme.colors.text}
              style={{ opacity: 0.6 }}
            />
            <Text style={styles.combatHeaderTitle}>EFICÁCIA OFENSIVA</Text>
          </View>

          <View style={styles.groupsContainer}>
            <View style={styles.combatGroup}>
              <View style={styles.groupHead}>
                <View style={[styles.dot, { backgroundColor: "#4ade80" }]} />
                <Text style={styles.groupLabel}>Super Eficaz (x2)</Text>
              </View>
              {renderChipList(
                offensive.superEffective,
                "Dano normal em todos.",
              )}
            </View>

            <View style={styles.combatGroup}>
              <View style={styles.groupHead}>
                <View style={[styles.dot, { backgroundColor: "#f87171" }]} />
                <Text style={styles.groupLabel}>Não muito Eficaz (x0.5)</Text>
              </View>
              {renderChipList(
                offensive.notVeryEffective,
                "Dano normal em todos.",
              )}
            </View>

            <View style={styles.combatGroup}>
              <View style={styles.groupHead}>
                <View style={[styles.dot, { backgroundColor: "#9ca3af" }]} />
                <Text style={styles.groupLabel}>Sem Efeito (x0)</Text>
              </View>
              {renderChipList(offensive.noEffect, "Afeta todos os tipos.")}
            </View>
          </View>
        </View>

        {/* SEÇÃO DEFENSIVA */}
        <View style={[styles.combatSection, { marginTop: 12 }]}>
          <View style={styles.combatHeader}>
            <Icon
              type="MaterialCommunityIcons"
              name="shield-half-full"
              size={18}
              color={theme.colors.text}
              style={{ opacity: 0.6 }}
            />
            <Text style={styles.combatHeaderTitle}>RESISTÊNCIA DEFENSIVA</Text>
          </View>

          <View style={styles.groupsContainer}>
            <View style={styles.combatGroup}>
              <View style={styles.groupHead}>
                <View style={[styles.dot, { backgroundColor: "#f87171" }]} />
                <Text style={styles.groupLabel}>Fraqueza (Recebe x2)</Text>
              </View>
              {renderChipList(defensive.vulnerableTo, "Não possui fraquezas.")}
            </View>

            <View style={styles.combatGroup}>
              <View style={styles.groupHead}>
                <View style={[styles.dot, { backgroundColor: "#4ade80" }]} />
                <Text style={styles.groupLabel}>
                  Resistente a (Recebe x0.5)
                </Text>
              </View>
              {renderChipList(defensive.resistantTo, "Nenhuma resistência.")}
            </View>

            <View style={styles.combatGroup}>
              <View style={styles.groupHead}>
                <View style={[styles.dot, { backgroundColor: "#a78bfa" }]} />
                <Text style={styles.groupLabel}>Imunidades (Zero Dano)</Text>
              </View>
              {renderChipList(defensive.immuneTo, "Sem imunidades nativas.")}
            </View>
          </View>
        </View>
      </View>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.5,
    marginLeft: 4,
  },
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  mainCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  headerIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    gap: 10,
  },
  indicatorPill: {
    width: 6,
    height: 18,
    borderRadius: 3,
  },
  indicatorText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  combatSection: {
    gap: 16,
  },
  combatHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150,150,150,0.2)",
  },
  combatHeaderTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    opacity: 0.6,
  },
  groupsContainer: {
    gap: 16,
    paddingLeft: 4,
  },
  combatGroup: {
    gap: 10,
  },
  groupHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.4,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    opacity: 0.3,
    fontStyle: "italic",
    paddingLeft: 14,
  },
});
