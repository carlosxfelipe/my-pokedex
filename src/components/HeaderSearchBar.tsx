import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function HeaderSearchBar() {
  const [query, setQuery] = useState("");
  const { dark } = useTheme();

  const textColor = dark ? "#000000" : "#FFFFFF";
  const placeholderColor = dark ? "#00000066" : "#FFFFFF99";
  const backgroundColor = dark ? "#00000025" : "#FFFFFF25";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <MaterialCommunityIcons name="magnify" size={18} color={textColor} />
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Buscar Pokémon..."
        placeholderTextColor={placeholderColor}
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    width: 220,
    gap: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});
