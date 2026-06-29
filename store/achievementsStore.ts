import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ACHIEVEMENTS } from "@/data/achievements";
import { APP_STORAGE_KEYS, jsonStorage } from "@/store/persist";
import type { AchievementState } from "@/types/models";

interface AchievementsState {
  achievements: AchievementState[];
  unlock: (achievementId: string) => void;
}

const initialAchievements: AchievementState[] = ACHIEVEMENTS.map((achievement) => ({
  achievementId: achievement.id,
  unlocked: false
}));

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set) => ({
      achievements: initialAchievements,
      unlock: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.map((entry) =>
            entry.achievementId === achievementId
              ? {
                  ...entry,
                  unlocked: true,
                  unlockedAt: entry.unlockedAt ?? new Date().toISOString()
                }
              : entry
          )
        }));
      }
    }),
    {
      name: APP_STORAGE_KEYS.achievements,
      storage: jsonStorage,
      version: 1,
      migrate: (persistedState) => persistedState as AchievementsState
    }
  )
);
