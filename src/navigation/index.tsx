import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HeaderButton as NavHeaderButton,
  Text,
} from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { ComponentProps } from "react";
import { Platform, View } from "react-native";
import type { Theme as AppTheme } from "../themes";
import { Icon, IconProps } from "../components/Icon";
import { HeaderButton } from "../components/HeaderButton";

import { HeaderGradient } from "../components/HeaderGradient";
import { HeaderSearchBar } from "../components/HeaderSearchBar";
import { Home } from "./screens/Home";
import { Settings } from "./screens/Settings";
import { TypeMatchups } from "./screens/TypeMatchups";
import { NotFound } from "./screens/NotFound";
import { PokemonDetail } from "./screens/PokemonDetail";

type MaterialCommunityIconName = Extract<
  IconProps,
  { type: "MaterialCommunityIcons" }
>["name"];

function TabBarIcon({
  iconName,
  activeIconName,
  color,
  size,
  focused,
}: {
  iconName: MaterialCommunityIconName;
  activeIconName: MaterialCommunityIconName;
  color: string;
  size: number;
  focused: boolean;
}) {
  const theme = useTheme() as AppTheme;
  const pillColor = theme.colors.primary + "30";
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {focused && (
        <View
          style={{
            position: "absolute",
            width: 64,
            height: 32,
            borderRadius: 16,
            backgroundColor: pillColor,
          }}
        />
      )}
      <Icon
        type="MaterialCommunityIcons"
        name={focused ? activeIconName : iconName}
        color={color}
        size={size}
      />
    </View>
  );
}

const tabItems: {
  name: string;
  component: React.ComponentType<any>;
  title: string;
  iconName: MaterialCommunityIconName;
  activeIconName: MaterialCommunityIconName;
  headerTitle?: () => React.ReactNode;
}[] = [
  {
    name: "Home",
    component: Home,
    title: "Início",
    iconName: "home-outline",
    activeIconName: "home",
    headerTitle: () => (
      <HeaderSearchBar
        leftIcon={{ icon: "pokeball", onPress: () => {} }}
        rightIcon={{ icon: "cog-outline", screen: "Settings" }}
      />
    ),
  },
  {
    name: "Matchups",
    component: TypeMatchups,
    title: "Combate",
    iconName: "sword-cross",
    activeIconName: "sword-cross",
  },
];

const HomeTabs = createBottomTabNavigator({
  screenOptions: ({ theme }) => {
    const appTheme = theme as AppTheme;

    return {
      headerStyle: {
        backgroundColor: "transparent",
      },
      headerBackground: () => <HeaderGradient />,
      headerTintColor: appTheme.dark ? "#000000" : "#FFFFFF",
      tabBarStyle: {
        backgroundColor: appTheme.colors.tabBar,
        borderTopColor: appTheme.colors.border,
      },
      tabBarActiveTintColor: appTheme.colors.primary,
      tabBarInactiveTintColor: appTheme.colors.text,
      tabBarIconStyle: {
        width: 64,
        height: 32,
      },
      tabBarLabelStyle: {
        marginTop: 4,
      },
    };
  },
  screens: Object.fromEntries(
    tabItems.map((tab) => [
      tab.name,
      {
        screen: tab.component,
        options: {
          title: tab.title,
          ...(tab.headerTitle
            ? { headerTitle: tab.headerTitle, headerRight: () => null }
            : {}),
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon
              iconName={tab.iconName}
              activeIconName={tab.activeIconName}
              color={color}
              size={size}
              focused={focused}
            />
          ),
        },
      },
    ]),
  ),
});

const RootStack = createNativeStackNavigator({
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

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
