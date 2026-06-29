import { useMemo } from "react";

import { DAILY_PROTOCOL_TASKS } from "@/constants/protocol";
import { AnalyticsService } from "@/services/AnalyticsService";
import { useTaskStore } from "@/store/taskStore";

export const useTasks = () => {
  const recordsByDay = useTaskStore((state) => state.recordsByDay);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const getTodayRecords = useTaskStore((state) => state.getTodayRecords);

  const todayRecords = getTodayRecords();
  const completion = AnalyticsService.completionPercentage(todayRecords);

  const tasks = useMemo(
    () =>
      DAILY_PROTOCOL_TASKS.map((task) => ({
        ...task,
        completed: todayRecords.find((item) => item.taskId === task.id)?.completed ?? false
      })),
    [todayRecords]
  );

  const streak = useMemo(() => AnalyticsService.streakFromDays(recordsByDay), [recordsByDay]);

  return {
    tasks,
    completion,
    streak,
    toggleTask
  };
};
