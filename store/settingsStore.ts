import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_WATER_GOAL_ML } from "@/constants/protocol";
import { APP_STORAGE_KEYS, jsonStorage } from "@/store/persist";
import type { AppSettings } from "@/types/models";

interface SettingsState {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const initialSettings: AppSettings = {
  themeMode: "system",
  notificationsEnabled: true,
  waterGoalMl: DEFAULT_WATER_GOAL_ML,
  weightUnit: "kg",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dynamicColorAndroid: true
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: initialSettings,
      updateSettings: (patch) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...patch
          }
        }));
      }
    }),
    {
      name: APP_STORAGE_KEYS.settings,
      storage: jsonStorage,
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as {
          settings?: Partial<AppSettings> & { waterGoalOz?: number };
        };
        const legacyOz = state.settings?.waterGoalOz;
        const derivedMl = typeof legacyOz === "number" ? Math.round(legacyOz * 29.5735) : undefined;

        return {
          settings: {
            ...initialSettings,
            ...state.settings,
            waterGoalMl: state.settings?.waterGoalMl ?? derivedMl ?? DEFAULT_WATER_GOAL_ML,
            weightUnit: "kg"
          }
        } as unknown as SettingsState;
      }
    }
  )
);
