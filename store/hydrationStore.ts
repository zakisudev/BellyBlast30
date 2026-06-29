import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_WATER_GOAL_ML } from "@/constants/protocol";
import { APP_STORAGE_KEYS, jsonStorage } from "@/store/persist";
import { todayISO } from "@/utils/date";

interface HydrationState {
  goalMl: number;
  entriesByDay: Record<string, number>;
  addWater: (amountMl: number) => void;
  setGoal: (goalMl: number) => void;
  getTodayWater: () => number;
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      goalMl: DEFAULT_WATER_GOAL_ML,
      entriesByDay: {},
      addWater: (amountMl) => {
        const date = todayISO();
        const current = get().entriesByDay[date] ?? 0;

        set((state) => ({
          entriesByDay: {
            ...state.entriesByDay,
            [date]: Math.max(0, current + amountMl)
          }
        }));
      },
      setGoal: (goalMl) => set({ goalMl }),
      getTodayWater: () => get().entriesByDay[todayISO()] ?? 0
    }),
    {
      name: APP_STORAGE_KEYS.hydration,
      storage: jsonStorage,
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as {
          goalMl?: number;
          goalOz?: number;
          entriesByDay?: Record<string, number>;
        };

        const goalMl =
          state.goalMl ??
          (typeof state.goalOz === "number"
            ? Math.round(state.goalOz * 29.5735)
            : DEFAULT_WATER_GOAL_ML);

        return {
          goalMl,
          entriesByDay: state.entriesByDay ?? {}
        } as unknown as HydrationState;
      }
    }
  )
);
