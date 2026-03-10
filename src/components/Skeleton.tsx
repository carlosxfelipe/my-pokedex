import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle, DimensionValue } from "react-native";
import { useTheme } from "@react-navigation/native";
import type { Theme as AppTheme } from "../themes";

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
}

export function Skeleton({
  style,
  width,
  height,
  borderRadius = 8,
}: SkeletonProps) {
  const theme = useTheme() as AppTheme;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          opacity,
          backgroundColor: theme.dark ? "#333333" : "#E0E0E0",
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}
