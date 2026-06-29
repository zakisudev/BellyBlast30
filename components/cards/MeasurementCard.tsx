import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { GlassCard } from "@/components/ui/GlassCard";
import type { MeasurementEntry } from "@/types/models";

interface MeasurementCardProps {
  latest?: MeasurementEntry;
}

export const MeasurementCard = ({ latest }: MeasurementCardProps) => {
  if (!latest) {
    return (
      <GlassCard>
        <Text variant="titleMedium">Measurements</Text>
        <Text variant="bodyMedium" style={styles.empty}>
          Add your first entry to start trend tracking.
        </Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <Text variant="titleMedium">Latest Measurement</Text>
      <View style={styles.row}>
        <Text variant="bodyLarge">Weight: {latest.weightKg} kg</Text>
        <Text variant="bodyLarge">Waist: {latest.waistCm} cm</Text>
      </View>
      <Text variant="labelMedium" style={styles.date}>
        {latest.date}
      </Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8
  },
  date: {
    marginTop: 6,
    opacity: 0.7
  },
  empty: {
    marginTop: 8,
    opacity: 0.8
  }
});
