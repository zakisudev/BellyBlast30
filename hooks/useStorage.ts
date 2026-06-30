import { useState } from "react";

import { DEFAULT_WATER_GOAL_ML } from "@/constants/protocol";
import { ACHIEVEMENTS } from "@/data/achievements";
import { StorageService } from "@/services/StorageService";
import { useAchievementsStore } from "@/store/achievementsStore";
import { useFeedbackStore } from "@/store/feedbackStore";
import { useHydrationStore } from "@/store/hydrationStore";
import { useProgressStore } from "@/store/progressStore";
import { INITIAL_SETTINGS, useSettingsStore } from "@/store/settingsStore";
import { useStatisticsStore } from "@/store/statisticsStore";
import { useTaskStore } from "@/store/taskStore";

export const useStorage = () => {
  const [loading, setLoading] = useState(false);

  const clearAppStorage = async (): Promise<string> => {
    setLoading(true);
    const result = await StorageService.clearAll();

    if (result.ok) {
      useTaskStore.setState({ recordsByDay: {} });
      useHydrationStore.setState({ goalMl: DEFAULT_WATER_GOAL_ML, entriesByDay: {} });
      useProgressStore.setState({ measurements: [], photos: [] });
      useAchievementsStore.setState({
        achievements: ACHIEVEMENTS.map((achievement) => ({
          achievementId: achievement.id,
          unlocked: false
        }))
      });
      useStatisticsStore.setState({
        longestStreak: 0,
        currentStreak: 0,
        completionRate: 0
      });
      useSettingsStore.setState({ settings: INITIAL_SETTINGS });
      useFeedbackStore.setState({ message: "", tone: "info", visible: false });
    }

    setLoading(false);
    return result.ok ? "All local data has been reset." : result.error.message;
  };

  return {
    loading,
    clearAppStorage
  };
};
