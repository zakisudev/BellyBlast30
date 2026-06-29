import { useMemo } from "react";

import { AnalyticsService } from "@/services/AnalyticsService";
import { useHydrationStore } from "@/store/hydrationStore";
import { useProgressStore } from "@/store/progressStore";
import { useTaskStore } from "@/store/taskStore";

export const useStatistics = () => {
  const recordsByDay = useTaskStore((state) => state.recordsByDay);
  const measurements = useProgressStore((state) => state.measurements);
  const hydration = useHydrationStore((state) => state.entriesByDay);

  const currentStreak = useMemo(
    () => AnalyticsService.streakFromDays(recordsByDay),
    [recordsByDay]
  );

  const completionRate = useMemo(() => {
    const days = Object.values(recordsByDay);
    if (days.length === 0) {
      return 0;
    }

    const completed = days
      .map((day) => AnalyticsService.completionPercentage(day))
      .reduce((sum, value) => sum + value, 0);

    return Math.round(completed / days.length);
  }, [recordsByDay]);

  const weightTrend = useMemo(
    () => AnalyticsService.trend(measurements, "weightKg"),
    [measurements]
  );
  const waistTrend = useMemo(() => AnalyticsService.trend(measurements, "waistCm"), [measurements]);

  const hydrationTrend = useMemo(() => Object.values(hydration), [hydration]);

  return {
    currentStreak,
    completionRate,
    weightTrend,
    waistTrend,
    hydrationTrend
  };
};
