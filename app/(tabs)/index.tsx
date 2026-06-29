import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, useTheme } from "react-native-paper";

import { QuoteCard } from "@/components/cards/QuoteCard";
import { StatCard } from "@/components/cards/StatCard";
import { TaskCard } from "@/components/cards/TaskCard";
import { ProgressRing } from "@/components/progress/ProgressRing";
import { WaterTracker } from "@/components/progress/WaterTracker";
import { useHydration } from "@/hooks/useHydration";
import { useTasks } from "@/hooks/useTasks";
import { QuoteService } from "@/services/QuoteService";
import type { AppTheme } from "@/theme/paper";
import { todayISO } from "@/utils/date";

export default function HomeScreen() {
  const { tasks, completion, streak, toggleTask } = useTasks();
  const { goalMl, todayMl, progress, addWater } = useHydration();
  const theme = useTheme<AppTheme>();

  const backgroundGradient = theme.dark
    ? (["#070E14", "#0E1822", "#111B27"] as const)
    : (["#E6F3FF", "#EDF8F5", "#F5F9FF"] as const);

  const taskTints = theme.dark
    ? ["#1A2C2A", "#1B2534", "#332A1E", "#1A2733", "#202E1D", "#2A2420"]
    : ["#E8F8F2", "#E6F2FF", "#FFF4E7", "#EAF8FF", "#EEF7E9", "#F7F0E5"];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <LinearGradient colors={backgroundGradient} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.headerBlock, theme.dark && styles.headerBlockDark]}>
            <Text variant="headlineSmall" style={[styles.title, theme.dark && styles.titleDark]}>
              BellyBlast 30
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Complete six daily habits and keep your momentum.
            </Text>
            <View style={styles.heroProgressWrap}>
              <View style={[styles.heroProgressTrack, theme.dark && styles.heroProgressTrackDark]}>
                <LinearGradient
                  colors={theme.dark ? ["#65E7CE", "#C8F774"] : ["#30BDAE", "#A5DB54"]}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={[styles.heroProgressFill, { width: `${completion}%` }]}
                />
              </View>
              <Text
                variant="titleMedium"
                style={[styles.heroPercent, theme.dark && styles.titleDark]}
              >
                {completion}%
              </Text>
            </View>
          </View>

          <View style={styles.heroRow}>
            <ProgressRing progress={completion / 100} label="Today" />
            <View style={styles.statColumn}>
              <StatCard title="Current Streak" value={`${streak} days`} icon="fire" tone="amber" />
              <StatCard title="Completion" value={`${completion}%`} icon="target" tone="blue" />
            </View>
          </View>

          <QuoteCard quote={QuoteService.getDailyQuote(todayISO())} tone="mint" />

          <WaterTracker
            goalMl={goalMl}
            todayMl={todayMl}
            progress={progress}
            onAddWater={addWater}
            tint={theme.dark ? "#15293A" : "#DFF1FF"}
          />

          <Text variant="titleLarge" style={styles.sectionTitle}>
            Today's Protocol
          </Text>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              dueTime={task.dueTime}
              completed={task.completed}
              onToggle={() => toggleTask(task.id)}
              tint={
                task.completed
                  ? theme.dark
                    ? "#1E3328"
                    : "#DFF4E8"
                  : taskTints[Math.abs(task.id.length) % taskTints.length]
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBlock: {
    marginBottom: 10,
    padding: 18,
    borderRadius: 24,
    backgroundColor: "#FFFFFF88"
  },
  headerBlockDark: {
    backgroundColor: "#111C28CC"
  },
  title: {
    fontWeight: "800",
    letterSpacing: 0.3
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
    marginBottom: 14,
    opacity: 0.74,
    lineHeight: 20
  },
  heroProgressWrap: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  heroProgressTrack: {
    flex: 1,
    height: 12,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#CDDCE8"
  },
  heroProgressTrackDark: {
    backgroundColor: "#273647"
  },
  heroProgressFill: {
    height: "100%",
    borderRadius: 999
  },
  heroPercent: {
    fontWeight: "800"
  },
  heroRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 12
  },
  statColumn: {
    flex: 1,
    gap: 8
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 8
  }
});
