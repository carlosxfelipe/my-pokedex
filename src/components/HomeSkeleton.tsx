import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { ThemedView } from "./ThemedView";
import { Skeleton } from "./Skeleton";
import type { Theme as AppTheme } from "../themes";

export function HomeSkeleton() {
  const theme = useTheme() as AppTheme;
  const fakeData = Array.from({ length: 8 }).map((_, i) => i);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={fakeData}
        keyExtractor={(item) => String(item)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={() => (
          <View
            style={[
              styles.skeletonCard,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <View
              style={[
                styles.skeletonBadge,
                { backgroundColor: theme.colors.border + "30" },
              ]}
            >
              <Skeleton width={96} height={96} borderRadius={48} />
            </View>
            <View style={styles.skeletonInfo}>
              <Skeleton width={30} height={12} borderRadius={4} />
              <Skeleton width={80} height={16} borderRadius={4} />
              <View style={styles.skeletonTags}>
                <Skeleton width={45} height={18} borderRadius={6} />
                <Skeleton width={45} height={18} borderRadius={6} />
              </View>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 12, gap: 12 },
  row: { gap: 12 },
  skeletonCard: { flex: 1, borderRadius: 16, overflow: "hidden" },
  skeletonBadge: { width: "100%", alignItems: "center", paddingVertical: 12 },
  skeletonInfo: { padding: 10, gap: 8, alignItems: "center" },
  skeletonTags: { flexDirection: "row", gap: 4, marginTop: 2 },
});
