import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { PlatformSwitch } from "../../components/PlatformSwitch";
import { useTheme } from "@react-navigation/native";
import { ThemedScrollView } from "../../components/ThemedScrollView";
import { ThemedStatusBar } from "../../components/ThemedStatusBar";
import { Text } from "../../components/Text";
import { ContrastText } from "../../components/ContrastText";
import { Chip } from "../../components/Chip";
import { Button } from "../../components/Button";
import { useSettingsStore } from "../../store/useSettingsStore";
import { clearDatabase } from "../../infrastructure/database/PokemonDatabase";
import type { Theme as AppTheme } from "../../themes";
import {
  TYPE_LABELS_PT,
  TYPE_COLORS_LIGHT,
  TYPE_COLORS_DARK,
} from "../../utils/pokemonTypes";
import type { PokemonType } from "../../domain/value-objects/PokemonType";

export function Settings() {
  const {
    language,
    setLanguage,
    typeFilter,
    setTypeFilter,
    showAllGenerations,
    setShowAllGenerations,
  } = useSettingsStore();
  const theme = useTheme() as AppTheme;

  const TYPE_COLORS = theme.dark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT;

  const typeEntries = Object.entries(TYPE_LABELS_PT) as [PokemonType, string][];

  // Handler do Switch de idioma (Inglês <-> Espanhol)
  const isSpanish = language === "es";
  const toggleLanguage = () => setLanguage(isSpanish ? "en" : "es");

  return (
    <ThemedScrollView contentContainerStyle={styles.container}>
      <ThemedStatusBar />
      {/* SEÇÃO: IDIOMA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Idioma dos Dados</Text>
        <View style={styles.switchRowContainer}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Traduzir para o Espanhol</Text>
              <Text style={styles.switchDescription}>
                Apenas os nomes dos golpes e movimentos ficarão em espanhol.
              </Text>
            </View>
            <PlatformSwitch
              value={isSpanish}
              onValueChange={toggleLanguage}
              trackColor={{ true: theme.colors.primary, false: "#767577" }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>
      </View>

      {/* SEÇÃO: GERAÇÕES DA POKÉDEX */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gerações da Pokédex</Text>
        <View style={styles.switchRowContainer}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Exibir Todas as Gerações</Text>
              <Text style={styles.switchDescription}>
                Atenção: Pokémons adicionados aqui podem não existir nos jogos
                originais FireRed e LeafGreen (Acima do #386).
              </Text>
            </View>
            <PlatformSwitch
              value={showAllGenerations}
              onValueChange={setShowAllGenerations}
              trackColor={{ true: theme.colors.primary, false: "#767577" }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>
      </View>

      {/* SEÇÃO: TIPOS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filtrar Pokédex por Tipo</Text>

        <TouchableOpacity
          style={[
            styles.resetButton,
            {
              backgroundColor:
                typeFilter === "all" ? theme.colors.primary : theme.colors.card,
            },
          ]}
          onPress={() => setTypeFilter("all")}
          activeOpacity={0.8}
        >
          <ContrastText
            backgroundColor={
              typeFilter === "all" ? theme.colors.primary : theme.colors.card
            }
            style={styles.resetButtonText}
          >
            {typeFilter === "all" ? "✓ Exibindo Todos" : "Limpar Filtro"}
          </ContrastText>
        </TouchableOpacity>

        <View style={styles.typesGrid}>
          {typeEntries.map(([key, label]) => {
            const isSelected = key === typeFilter;
            const typeColor = TYPE_COLORS[key];

            return (
              <Chip
                key={key}
                label={label}
                selected={isSelected}
                color={typeColor}
                onPress={() => setTypeFilter(key)}
              />
            );
          })}
        </View>
      </View>

      {/* SEÇÃO: CACHE */}
      <View style={[styles.section, { marginTop: 16 }]}>
        <Text style={styles.sectionTitle}>Armazenamento</Text>
        <Button
          variant="tinted"
          shape="rounded"
          onPress={() => {
            Alert.alert(
              "Limpar Cache",
              "Isso removerá todos os Pokémons salvos offline. Você precisará de internet para carregar os detalhes novamente. Continuar?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Limpar Tudo",
                  style: "destructive",
                  onPress: async () => {
                    await clearDatabase();
                    Alert.alert("Sucesso", "O cache da Pokédex foi limpo!");
                  },
                },
              ],
            );
          }}
        >
          Limpar Cache da Pokédex
        </Button>
      </View>
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    gap: 32,
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
  switchRowContainer: {
    paddingVertical: 4,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    opacity: 0.6,
  },
  resetButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
});
