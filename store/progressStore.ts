import { create } from "zustand";
import { persist } from "zustand/middleware";

import { APP_STORAGE_KEYS, jsonStorage } from "@/store/persist";
import type { MeasurementEntry, ProgressPhoto } from "@/types/models";

interface ProgressState {
  measurements: MeasurementEntry[];
  photos: ProgressPhoto[];
  addMeasurement: (entry: MeasurementEntry) => void;
  addPhoto: (photo: ProgressPhoto) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      measurements: [],
      photos: [],
      addMeasurement: (entry) => set((state) => ({ measurements: [...state.measurements, entry] })),
      addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] }))
    }),
    {
      name: APP_STORAGE_KEYS.progress,
      storage: jsonStorage,
      version: 1,
      migrate: (persistedState) => persistedState as ProgressState
    }
  )
);
