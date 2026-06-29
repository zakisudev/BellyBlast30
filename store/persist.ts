import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage } from "zustand/middleware";

const STORAGE_VERSION = 1;

export const APP_STORAGE_KEYS = {
  tasks: "bb30_tasks",
  hydration: "bb30_hydration",
  progress: "bb30_progress",
  settings: "bb30_settings",
  achievements: "bb30_achievements",
  statistics: "bb30_statistics"
} as const;

export const jsonStorage = createJSONStorage(() => AsyncStorage);

export const withVersion = <T>(state: T) => ({
  version: STORAGE_VERSION,
  data: state
});
