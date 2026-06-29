import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import type { ReactNode } from "react";

import { GlassCard } from "@/components/ui/GlassCard";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <GlassCard>
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        {children}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  title: {
    marginBottom: 6
  }
});
