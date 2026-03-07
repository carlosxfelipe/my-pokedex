import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { View } from "react-native";
import type { Theme as AppTheme } from "../themes";

import { HeaderGradient } from "../components/HeaderGradient";
import { HeaderSearchBar } from "../components/HeaderSearchBar";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";
import { About } from "./screens/About";
import { NotFound } from "./screens/NotFound";

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

function TabBarIcon({
  iconName,
  activeIconName,
  color,
  size,
  focused,
}: {
  iconName: MaterialIconName;
  activeIconName: MaterialIconName;
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
      <MaterialCommunityIcons
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
  iconName: MaterialIconName;
  activeIconName: MaterialIconName;
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
    name: "About",
    component: About,
    title: "Sobre",
    iconName: "information-outline",
    activeIconName: "information",
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
        title: "Home",
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      linking: {
        path: ":user(@[a-zA-Z0-9-_]+)",
        parse: {
          user: (value) => value.replace(/^@/, ""),
        },
        stringify: {
          user: (value) => `@${value}`,
        },
      },
    },
    Settings: {
      screen: Settings,
      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
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
