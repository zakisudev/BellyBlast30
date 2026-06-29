import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Dialog, Portal, Text, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import { CalendarCell } from "@/components/common/CalendarCell";
import { StatCard } from "@/components/cards/StatCard";
import { useTaskStore } from "@/store/taskStore";
import { SafeAreaView } from "react-native-safe-area-context";
import type { AppTheme } from "@/theme/paper";

export default function CalendarScreen() {
  const recordsByDay = useTaskStore((state) => state.recordsByDay);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const theme = useTheme<AppTheme>();

  const statusForDay = (day: number): "complete" | "partial" | "missed" => {
    const monthPrefix = new Date().toISOString().slice(0, 8);
    const dayString = String(day).padStart(2, "0");
    const key = `${monthPrefix}${dayString}`;
    const records = recordsByDay[key];

    if (!records || records.length === 0) {
      return "missed";
    }

    const completedCount = records.filter((item) => item.completed).length;
    if (completedCount === 6) {
      return "complete";
    }
    if (completedCount > 0) {
      return "partial";
    }
    return "missed";
  };

  const statuses = Array.from({ length: 30 }, (_, index) => statusForDay(index + 1));
  const completeCount = statuses.filter((status) => status === "complete").length;
  const partialCount = statuses.filter((status) => status === "partial").length;
  const missedCount = statuses.filter((status) => status === "missed").length;
  const backgroundGradient = theme.dark
    ? (["#070F18", "#0E1824", "#131C29"] as const)
    : (["#EAF3FF", "#EEF9F4", "#F7F8FF"] as const);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient colors={backgroundGradient} style={StyleSheet.absoluteFill} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={[styles.title, theme.dark && styles.titleDark]}>
          30-Day Calendar
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Tap any day to inspect completion details.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCol}>
            <StatCard title="Complete" value={`${completeCount}`} icon="check-circle" tone="teal" />
          </View>
          <View style={styles.summaryCol}>
            <StatCard
              title="Partial"
              value={`${partialCount}`}
              icon="progress-clock"
              tone="amber"
            />
          </View>
          <View style={styles.summaryCol}>
            <StatCard title="Missed" value={`${missedCount}`} icon="close-circle" tone="blue" />
          </View>
        </View>

        <View style={styles.grid}>
          {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
            <CalendarCell
              key={day}
              day={day}
              status={statusForDay(day)}
              selected={selectedDay === day}
              onPress={() => setSelectedDay(day)}
            />
          ))}
        </View>

        <Portal>
          <Dialog visible={selectedDay !== null} onDismiss={() => setSelectedDay(null)}>
            <Dialog.Title>Day {selectedDay}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Status: {selectedDay ? statusForDay(selectedDay) : "N/A"}. Complete all six tasks
                for a perfect day.
              </Text>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: 18,
    paddingBottom: 120
  },
  title: {
    fontWeight: "800"
  },
  titleDark: {
    color: "#EAF2F7"
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 12,
    opacity: 0.75,
    lineHeight: 20
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10
  },
  summaryCol: {
    flex: 1
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
});
