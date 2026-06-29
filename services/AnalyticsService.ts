import { DAILY_PROTOCOL_TASKS } from "@/constants/protocol";
import type { DailyTaskRecord, MeasurementEntry } from "@/types/models";

export class AnalyticsService {
  static completionPercentage(records: DailyTaskRecord[]): number {
    if (records.length === 0) {
      return 0;
    }

    const done = records.filter((record) => record.completed).length;
    return Math.round((done / DAILY_PROTOCOL_TASKS.length) * 100);
  }

  static streakFromDays(days: Record<string, DailyTaskRecord[]>): number {
    const sortedDates = Object.keys(days).sort().reverse();
    let streak = 0;

    for (const date of sortedDates) {
      const isPerfect = days[date]?.every((record) => record.completed);
      if (isPerfect) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  }

  static trend(entries: MeasurementEntry[], key: "weightKg" | "waistCm"): number[] {
    return entries
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((entry) => (key === "weightKg" ? entry.weightKg : entry.waistCm));
  }
}
