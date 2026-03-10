import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedView } from "./ThemedView";
import { Skeleton } from "./Skeleton";

export function PokemonDetailSkeleton() {
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.hero, { paddingTop: 60 }]}>
        <Skeleton width={160} height={160} borderRadius={80} />
        <View style={styles.heroInfo}>
          <Skeleton width={60} height={16} borderRadius={4} />
          <Skeleton width={180} height={32} borderRadius={8} />
          <View style={styles.heroTypes}>
            <Skeleton width={80} height={28} borderRadius={14} />
            <Skeleton width={80} height={28} borderRadius={14} />
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <View>
          <Skeleton width={120} height={20} borderRadius={4} />
          <View style={styles.listContainer}>
            <Skeleton width="100%" height={60} borderRadius={8} />
            <Skeleton width="100%" height={60} borderRadius={8} />
          </View>
        </View>
        <View>
          <Skeleton width={150} height={20} borderRadius={4} />
          <View style={styles.listContainerSmall}>
            <Skeleton width="100%" height={40} borderRadius={8} />
            <Skeleton width="100%" height={40} borderRadius={8} />
            <Skeleton width="100%" height={40} borderRadius={8} />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  heroInfo: { marginTop: 24, alignItems: "center", gap: 8 },
  heroTypes: { flexDirection: "row", gap: 8, marginTop: 8 },
  content: { padding: 24, gap: 32 },
  listContainer: { marginTop: 16, gap: 12 },
  listContainerSmall: { marginTop: 16, gap: 8 },
});
