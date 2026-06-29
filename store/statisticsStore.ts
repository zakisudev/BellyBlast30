import { create } from "zustand";
import { persist } from "zustand/middleware";

import { APP_STORAGE_KEYS, jsonStorage } from "@/store/persist";

interface StatisticsState {
  longestStreak: number;
  currentStreak: number;
  completionRate: number;
  updateStats: (payload: Partial<Omit<StatisticsState, "updateStats">>) => void;
}

export const useStatisticsStore = create<StatisticsState>()(
  persist(
    (set) => ({
      longestStreak: 0,
      currentStreak: 0,
      completionRate: 0,
      updateStats: (payload) => set(payload)
    }),
    {
      name: APP_STORAGE_KEYS.statistics,
      storage: jsonStorage,
      version: 1,
      migrate: (persistedState) => persistedState as StatisticsState
    }
  )
);
