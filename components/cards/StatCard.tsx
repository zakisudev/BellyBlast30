import { StyleSheet, View } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

import { GlassCard } from "@/components/ui/GlassCard";
import type { AppTheme } from "@/theme/paper";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  tone?: "teal" | "blue" | "amber";
}

const toneMap = {
  teal: {
    card: "#D9F4EE",
    bubble: "#BFEADF",
    icon: "#117466"
  },
  blue: {
    card: "#DDEEFF",
    bubble: "#C5E2FF",
    icon: "#1B6E9B"
  },
  amber: {
    card: "#FCEFD8",
    bubble: "#F8E3BF",
    icon: "#9B671B"
  }
} as const;

export const StatCard = ({ title, value, icon, tone = "blue" }: StatCardProps) => {
  const theme = useTheme<AppTheme>();
  const palette = toneMap[tone];
  const cardTint = theme.dark ? `${palette.icon}26` : palette.card;
  const bubbleTint = theme.dark ? `${palette.icon}3D` : palette.bubble;

  return (
    <GlassCard padding={18} tint={cardTint}>
      <View style={styles.header}>
        <View style={[styles.iconBubble, { backgroundColor: bubbleTint }]}>
          <Icon source={icon} size={18} color={palette.icon} />
        </View>
        <Text variant="labelLarge" style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
      </View>
      <Text variant="headlineSmall" style={[styles.value, { color: theme.colors.onSurface }]}>
        {value}
      </Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  iconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    opacity: 0.82
  },
  value: {
    marginTop: 10,
    fontWeight: "800",
    letterSpacing: 0.2
  }
});
