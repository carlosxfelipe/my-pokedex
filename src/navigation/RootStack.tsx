import {
  HeaderButton as NavHeaderButton,
  Text,
} from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { HeaderButton } from "../components/HeaderButton";
import { HeaderGradient } from "../components/HeaderGradient";
import { HomeTabs } from "./HomeTabs";
import { PokemonDetail } from "./screens/PokemonDetail";
import { Settings } from "./screens/Settings";
import { NotFound } from "./screens/NotFound";
import type { Theme as AppTheme } from "../themes";

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
        title: "Início",
        headerShown: false,
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }: any) => ({
        presentation: "modal",
        title: Platform.OS === "android" ? "" : "Configurações",
        headerTitleAlign: "center",
        headerLeft: Platform.OS === "android" ? () => null : undefined,
        headerBackVisible: false,
        headerRight: () => (
          <NavHeaderButton onPress={navigation.goBack}>
            <Text style={{ fontSize: 16 }}>Fechar</Text>
          </NavHeaderButton>
        ),
      }),
    },
    PokemonDetail: {
      screen: PokemonDetail,
      options: ({ navigation, theme }: any) => {
        const appTheme = theme as AppTheme;
        const color = appTheme.dark ? "#000000" : "#FFFFFF";
        return {
          title: Platform.OS === "android" ? "" : "Detalhes",
          headerTitleAlign: Platform.OS === "android" ? "center" : undefined,
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
