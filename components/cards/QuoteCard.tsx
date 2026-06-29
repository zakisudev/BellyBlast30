import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { GlassCard } from "@/components/ui/GlassCard";
import type { AppTheme } from "@/theme/paper";

interface QuoteCardProps {
  quote: string;
  tone?: "mint" | "sun";
}

const toneMap = {
  mint: "#DDF6EF",
  sun: "#FDEED8"
} as const;

export const QuoteCard = ({ quote, tone = "mint" }: QuoteCardProps) => {
  const theme = useTheme<AppTheme>();
  const tint = theme.dark ? "#1D2E2B" : toneMap[tone];

  return (
    <GlassCard padding={20} tint={tint}>
      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurface }]}>
        Daily Motivation
      </Text>
      <Text variant="titleMedium" style={[styles.quote, { color: theme.colors.onSurface }]}>
        "{quote}"
      </Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  label: {
    opacity: 0.78,
    marginBottom: 10,
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  quote: {
    lineHeight: 30,
    fontWeight: "700"
  }
});
