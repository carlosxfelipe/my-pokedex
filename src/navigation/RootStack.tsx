import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { HeaderButton } from "../components/HeaderButton";
import { HeaderGradient } from "../components/HeaderGradient";
import { HomeTabs } from "./HomeTabs";
import { PokemonDetail } from "./screens/PokemonDetail";
import { NotFound } from "./screens/NotFound";
import type { Theme as AppTheme } from "../themes";

import { capitalize } from "../utils/stringUtils";

export const RootStack = createNativeStackNavigator({
  screenOptions: ({ theme }) => {
    const appTheme = theme as AppTheme;

    return {
      headerStyle: {
        backgroundColor: "transparent",
      },
      headerBackground: () => <HeaderGradient />,
      headerTintColor: appTheme.dark ? "#000000" : "#FFFFFF",
      contentStyle: {
        backgroundColor: appTheme.colors.background,
      },
    };
  },
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Pokédex",
        headerShown: false,
      },
    },
    PokemonDetail: {
      screen: PokemonDetail,
      options: ({ navigation, route, theme }: any) => {
        const appTheme = theme as AppTheme;
        const pokemonName = capitalize(route.params?.name ?? "detalhes");
        return {
          title: pokemonName,
          headerTitleAlign: "center",
          headerBackTitleVisible: true,
          headerLeft:
            Platform.OS === "android"
              ? () => (
                  <HeaderButton
                    onPress={() => navigation.goBack()}
                    label="Voltar"
                  />
                )
              : undefined,
        };
      },
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});
