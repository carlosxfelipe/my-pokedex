import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@react-navigation/native";
import { TYPE_COLORS_LIGHT, TYPE_COLORS_DARK } from "../utils/pokemonTypes";

interface Props {
  pokemonName: string;
  typeFRLG: string;
  typeModern: string;
  mainType?: string; // tipo principal moderno (opcional)
}

export function TypeChangeCard({
  pokemonName,
  typeFRLG,
  typeModern,
  mainType,
}: Props) {
  const { colors, dark } = useTheme();
  // Descobrir cor do tipo principal
  let accentColor = undefined;
  if (mainType) {
    const typeKey = mainType.toLowerCase().split("/")[0].trim();
    accentColor = (dark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT)[
      typeKey as import("../domain/value-objects/PokemonType").PokemonType
    ];
  }
  return (
    <View style={[styles.container]}>
      <Text style={[styles.body, { color: colors.text }]}>
        Em{" "}
        <Text style={{ color: accentColor }}>Pokémon FireRed & LeafGreen</Text>,{" "}
        <Text style={{ color: accentColor }}>{pokemonName}</Text> era do tipo{" "}
        <Text style={{ color: accentColor }}>{typeFRLG}</Text>.{"\n"}Nas
        gerações modernas, ele é do tipo{" "}
        <Text style={{ color: accentColor }}>{typeModern}</Text>.
      </Text>
      <Text>
        Isso ocorre porque o tipo Fairy só foi criado na Geração 6 (Pokémon
        X/Y).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 14,
    marginVertical: 12,
  },
  title: {
    marginBottom: 6,
  },
  body: {
    marginBottom: 8,
  },
});
