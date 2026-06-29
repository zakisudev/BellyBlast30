import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef } from "react";

import { TrendChart } from "@/components/charts/TrendChart";
import { AchievementBadge } from "@/components/common/AchievementBadge";
import { StatCard } from "@/components/cards/StatCard";
import { useAchievements } from "@/hooks/useAchievements";
import { useScrollToTopOnFocus } from "@/hooks/useScrollToTopOnFocus";
import { useStatistics } from "@/hooks/useStatistics";
import type { AppTheme } from "@/theme/paper";

export default function AnalyticsScreen() {
  const { completionRate, currentStreak, hydrationTrend, waistTrend, weightTrend } =
    useStatistics();
  const { achievements } = useAchievements();
  const theme = useTheme<AppTheme>();
  const scrollRef = useRef<ScrollView>(null);

  useScrollToTopOnFocus(scrollRef);
  const backgroundGradient = theme.dark
    ? (["#07101A", "#0D1823", "#121D29"] as const)
    : (["#EAF4FF", "#EFFAF5", "#F7F9FF"] as const);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient colors={backgroundGradient} style={StyleSheet.absoluteFill} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={[styles.title, theme.dark && styles.titleDark]}>
          Analytics
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Insight into consistency, trends, and protocol momentum.
        </Text>

        <View style={[styles.heroPanel, theme.dark && styles.heroPanelDark]}>
          <Text variant="labelLarge" style={styles.heroLabel}>
            30-Day Insight
          </Text>
          <Text variant="headlineSmall" style={[styles.heroValue, theme.dark && styles.titleDark]}>
            {completionRate}% consistency
          </Text>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statCol}>
            <StatCard
              title="Current Streak"
              value={`${currentStreak} days`}
              icon="fire"
              tone="amber"
            />
          </View>
          <View style={styles.statCol}>
            <StatCard
              title="Completion Rate"
              value={`${completionRate}%`}
              icon="chart-arc"
              tone="blue"
            />
          </View>
        </View>

        <TrendChart title="Water Trend" points={hydrationTrend} color="#299CCB" />
        <TrendChart title="Weight Trend (kg)" points={weightTrend} color="#2D9A8D" />
        <TrendChart title="Waist Trend (cm)" points={waistTrend} color="#DA934A" />

        <Text variant="titleLarge" style={[styles.sectionTitle, theme.dark && styles.titleDark]}>
          Achievements
        </Text>
        {achievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            unlocked={achievement.unlocked}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontWeight: "800"
  },
  titleDark: {
    color: "#EAF2F7"
  },
  content: {
    padding: 18,
    paddingBottom: 120
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.75,
    marginBottom: 12,
    lineHeight: 20
  },
  heroPanel: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 10,
    backgroundColor: "#E2F2FF"
  },
  heroPanelDark: {
    backgroundColor: "#13283A"
  },
  heroLabel: {
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: 0.35
  },
  heroValue: {
    marginTop: 4,
    fontWeight: "800"
  },
  statRow: {
    flexDirection: "row",
    gap: 8
  },
  statCol: {
    flex: 1
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8
  }
});
