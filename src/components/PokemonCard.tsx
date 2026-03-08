import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Text } from "./Text";
import {
  TYPE_COLORS_LIGHT,
  TYPE_COLORS_DARK,
  TYPE_LABELS_PT,
} from "../utils/pokemonTypes";
import type { PokemonSummary } from "../domain/entities/Pokemon";
import type { Theme as AppTheme } from "../themes";

interface PokemonCardProps {
  pokemon: PokemonSummary;
  isCatchable?: boolean;
  onPress: () => void;
}

export function PokemonCard({
  pokemon,
  isCatchable = true,
  onPress,
}: PokemonCardProps) {
  const theme = useTheme() as AppTheme;
  const TYPE_COLORS = theme.dark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT;
  const primaryType = pokemon.types[0];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme.colors.card },
        !isCatchable && styles.uncatchableCard,
      ]}
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
            style={[styles.sprite, !isCatchable && styles.uncatchableSprite]}
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

const styles = StyleSheet.create({
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
    alignItems: "center",
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
    paddingVertical: 2, // Ajuste para clipping (iOS safe)
  },
  typeTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
  },
  uncatchableCard: {
    opacity: 0.5,
  },
  uncatchableSprite: {
    tintColor: "rgba(0,0,0,0.5)",
  },
});
