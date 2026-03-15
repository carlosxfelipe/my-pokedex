import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@react-navigation/native";
import { TYPE_COLORS_LIGHT, TYPE_COLORS_DARK } from "../utils/pokemonTypes";

interface Props {
  pokemonName: string;
  typeFRLG: string;
  typeModern: string;
  mainType?: string;
}

export function TypeChangeCard({
  pokemonName,
  typeFRLG,
  typeModern,
  mainType,
}: Props) {
  const { colors, dark } = useTheme();

  let accentColor = undefined;

  if (mainType) {
    const typeKey = mainType.toLowerCase().split("/")[0].trim();
    accentColor = (dark ? TYPE_COLORS_DARK : TYPE_COLORS_LIGHT)[
      typeKey as import("../domain/value-objects/PokemonType").PokemonType
    ];
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderLeftColor: accentColor,
        },
      ]}
    >
      <Text style={[styles.body, { color: colors.text }]}>
        Em{" "}
        <Text style={{ color: accentColor, fontWeight: "600" }}>
          Pokémon FireRed & LeafGreen
        </Text>
        ,{" "}
        <Text style={{ color: accentColor, fontWeight: "600" }}>
          {pokemonName}
        </Text>{" "}
        era do tipo{" "}
        <Text style={{ color: accentColor, fontWeight: "600" }}>
          {typeFRLG}
        </Text>
        .{"\n\n"}
        Nas gerações modernas, ele é do tipo{" "}
        <Text style={{ color: accentColor, fontWeight: "600" }}>
          {typeModern}
        </Text>
        .
      </Text>

      <Text style={[styles.note, { color: colors.text }]}>
        Isso ocorre porque o tipo Fairy só foi criado na Geração 6 (Pokémon
        X/Y).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  note: {
    marginTop: 10,
    fontSize: 13,
    opacity: 0.7,
  },
});
