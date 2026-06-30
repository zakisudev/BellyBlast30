import { useCallback } from "react";

import { useHydrationStore } from "@/store/hydrationStore";
import { useSettingsStore } from "@/store/settingsStore";

export const useHydration = () => {
  const fallbackGoalMl = useHydrationStore((state) => state.goalMl);
  const hydrationSetGoal = useHydrationStore((state) => state.setGoal);
  const settingsGoalMl = useSettingsStore((state) => state.settings.waterGoalMl);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const addWater = useHydrationStore((state) => state.addWater);
  const todayMl = useHydrationStore((state) => state.getTodayWater());
  const goalMl = settingsGoalMl || fallbackGoalMl;

  const progress = goalMl === 0 ? 0 : Math.min(todayMl / goalMl, 1);

  const setGoal = useCallback(
    (nextGoalMl: number) => {
      hydrationSetGoal(nextGoalMl);
      updateSettings({ waterGoalMl: nextGoalMl });
    },
    [hydrationSetGoal, updateSettings]
  );

  return {
    goalMl,
    todayMl,
    progress,
    addWater,
    setGoal
  };
};
