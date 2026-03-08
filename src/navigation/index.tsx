import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { RootStack } from "./RootStack";

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
