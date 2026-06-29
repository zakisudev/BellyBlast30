import * as Haptics from "expo-haptics";

import { ACHIEVEMENTS } from "@/data/achievements";
import { useAchievementsStore } from "@/store/achievementsStore";

export const useAchievements = () => {
  const achievementsState = useAchievementsStore((state) => state.achievements);
  const unlock = useAchievementsStore((state) => state.unlock);

  const achievements = ACHIEVEMENTS.map((achievement) => {
    const state = achievementsState.find((entry) => entry.achievementId === achievement.id);
    return {
      ...achievement,
      unlocked: state?.unlocked ?? false,
      unlockedAt: state?.unlockedAt
    };
  });

  const unlockWithHaptics = async (achievementId: string) => {
    unlock(achievementId);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return {
    achievements,
    unlockWithHaptics
  };
};
