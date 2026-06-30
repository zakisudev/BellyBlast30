import { StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { WATER_QUICK_ADD_OPTIONS_ML } from "@/constants/protocol";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import type { AppTheme } from "@/theme/paper";

interface WaterTrackerProps {
  goalMl: number;
  todayMl: number;
  progress: number;
  onAddWater: (amountMl: number) => void;
  tint?: string;
}

const toLiters = (ml: number): string => `${(ml / 1000).toFixed(1)} L`;

export const WaterTracker = ({
  goalMl,
  todayMl,
  progress,
  onAddWater,
  tint
}: WaterTrackerProps) => {
  const [customAmount, setCustomAmount] = useState("300");
  const theme = useTheme<AppTheme>();
  const overGoal = goalMl > 0 && todayMl > goalMl;
  const indicatorColors = overGoal
    ? theme.dark
      ? ["#F8C86A", "#70E38F"]
      : ["#F0A843", "#57C86F"]
    : theme.dark
      ? ["#6DE8D0", "#BFEA63"]
      : ["#2CAFA8", "#8FD54E"];

  return (
    <GlassCard padding={18} tint={tint}>
      <View style={styles.headerRow}>
        <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
          Hydration
        </Text>
        <Text variant="labelLarge" style={[styles.metricLabel, { color: theme.colors.onSurface }]}>
          {toLiters(todayMl)} / {toLiters(goalMl)}
        </Text>
      </View>
      <View style={[styles.barTrack, theme.dark && styles.barTrackDark]}>
        <LinearGradient
          colors={indicatorColors as [string, string]}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.barFill, { width: `${Math.round(progress * 100)}%` }]}
        />
      </View>
      {overGoal ? (
        <Text variant="bodySmall" style={[styles.supportText, { color: theme.colors.onSurface }]}>
          Amazing consistency. You are above goal today, keep it balanced and steady.
        </Text>
      ) : null}
      <View style={styles.quickRow}>
        {WATER_QUICK_ADD_OPTIONS_ML.map((amount) => (
          <GradientButton key={amount} label={`+${amount} ml`} onPress={() => onAddWater(amount)} />
        ))}
      </View>
      <View style={styles.customRow}>
        <TextInput
          mode="outlined"
          dense
          keyboardType="numeric"
          value={customAmount}
          onChangeText={setCustomAmount}
          label="Custom ml"
          style={styles.input}
        />
        <GradientButton
          label="Add"
          onPress={() => {
            const value = Number(customAmount);
            if (Number.isFinite(value) && value > 0) {
              onAddWater(value);
            }
          }}
        />
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontWeight: "700"
  },
  metricLabel: {
    opacity: 0.82,
    fontWeight: "700"
  },
  barTrack: {
    marginTop: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: "#D9E7F2",
    overflow: "hidden"
  },
  barTrackDark: {
    backgroundColor: "#2A3A4C"
  },
  barFill: {
    height: "100%",
    borderRadius: 999
  },
  supportText: {
    marginTop: 10,
    opacity: 0.8
  },
  quickRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap"
  },
  customRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center"
  },
  input: {
    flex: 1,
    backgroundColor: "transparent"
  }
});
