import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ThemedScrollView } from "../../components/ThemedScrollView";
import { Text } from "../../components/Text";
import { Chip } from "../../components/Chip";
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

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Chip
            label={`Analisando Foco: ${TYPE_LABELS_PT[selectedType].toUpperCase()}`}
            color={TYPE_COLORS[selectedType]}
            selected={true}
          />
        </View>

        {/* OFENSIVA */}
        <View style={styles.combatSection}>
          <Text style={[styles.combatTitle, { color: theme.colors.primary }]}>
            Ofensiva (Golpeando)
          </Text>

          <View style={styles.combatGroup}>
            <Text style={styles.combatLabel}>Eficaz (Dano x2)</Text>
            {renderChipList(
              offensive.superEffective,
              "Dano normal em todos.",
              true,
            )}
          </View>

          <View style={styles.combatGroup}>
            <Text style={styles.combatLabel}>Pouco Eficaz (Dano x0.5)</Text>
            {renderChipList(
              offensive.notVeryEffective,
              "Nenhum tipo resiste.",
              true,
            )}
          </View>

          <View style={styles.combatGroup}>
            <Text style={styles.combatLabel}>Sem Efeito (Dano Zero)</Text>
            {renderChipList(offensive.noEffect, "Afeta todos os tipos.", true)}
          </View>
        </View>

        {/* DEFENSIVA */}
        <View style={styles.combatSection}>
          <Text style={[styles.combatTitle, { color: "#3B82F6" }]}>
            Defensiva (Recebendo)
          </Text>

          <View style={styles.combatGroup}>
            <Text style={styles.combatLabel}>Fraqueza (Recebe x2)</Text>
            {renderChipList(defensive.vulnerableTo, "Não tem fraquezas.", true)}
          </View>

          <View style={styles.combatGroup}>
            <Text style={styles.combatLabel}>Resistência (Recebe x0.5)</Text>
            {renderChipList(
              defensive.resistantTo,
              "Nenhuma resistência.",
              true,
            )}
          </View>

          <View style={styles.combatGroup}>
            <Text style={styles.combatLabel}>Imunidades (Zero Dano)</Text>
            {renderChipList(
              defensive.immuneTo,
              "Sem imunidades nativas.",
              true,
            )}
          </View>
        </View>
      </View>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 32,
    paddingBottom: 40,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    opacity: 0.5,
  },
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    padding: 24,
    borderRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  combatSection: {
    marginBottom: 24,
  },
  combatTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.15)",
    paddingBottom: 12,
  },
  combatGroup: {
    marginBottom: 16,
  },
  combatLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    opacity: 0.7,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.4,
    fontStyle: "italic",
  },
});
