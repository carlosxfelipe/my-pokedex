import { View, Alert, Linking, Platform } from "react-native";
import {
  BottomTabBar,
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import { Icon, IconProps } from "../components/Icon";
import { HeaderGradient } from "../components/HeaderGradient";
import { HeaderSearchBar } from "../components/HeaderSearchBar";
import { Home } from "./screens/Home";
import { TypeMatchups } from "./screens/TypeMatchups";
import { Settings } from "./screens/Settings";
import type { Theme as AppTheme } from "../themes";

export type MaterialCommunityIconName = Extract<
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

const handleCreatorInfo = () => {
  Alert.alert(
    "Sobre o Projeto",
    "Desenvolvido por Carlos Felipe Araújo.\n\nConfira o código fonte no GitHub!",
    [
      {
        text: "Ver GitHub",
        onPress: () =>
          Linking.openURL("https://github.com/carlosxfelipe/my-pokedex"),
      },
      {
        text: "Fechar",
        style: "cancel",
      },
    ],
  );
};

function AndroidTabBar(props: BottomTabBarProps) {
  return (
    <BottomTabBar
      {...props}
      insets={{
        ...props.insets,
        bottom: props.insets.bottom + 8,
      }}
    />
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
        rightIcon={{ icon: "github", onPress: handleCreatorInfo }}
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
  {
    name: "Settings",
    component: Settings,
    title: "Ajustes",
    iconName: "cog-outline",
    activeIconName: "cog",
  },
];

export const HomeTabs = createBottomTabNavigator({
  ...(Platform.OS === "android" && {
    tabBar: (props: BottomTabBarProps) => <AndroidTabBar {...props} />,
  }),
  screenOptions: ({ theme }) => {
    const appTheme = theme as AppTheme;

    return {
      headerStyle: {
        backgroundColor: "transparent",
      },
      headerBackground: () => <HeaderGradient />,
      headerTitleAlign: "center",
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
