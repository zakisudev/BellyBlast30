import { useHydrationStore } from "@/store/hydrationStore";

export const useHydration = () => {
  const goalMl = useHydrationStore((state) => state.goalMl);
  const addWater = useHydrationStore((state) => state.addWater);
  const setGoal = useHydrationStore((state) => state.setGoal);
  const todayMl = useHydrationStore((state) => state.getTodayWater());

  const progress = goalMl === 0 ? 0 : Math.min(todayMl / goalMl, 1);

  return {
    goalMl,
    todayMl,
    progress,
    addWater,
    setGoal
  };
};
