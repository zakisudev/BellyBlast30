import { useEffect, useMemo, useState } from "react";

import { DAILY_PROTOCOL_TASKS } from "@/constants/protocol";
import { AnalyticsService } from "@/services/AnalyticsService";
import { useTaskStore } from "@/store/taskStore";
import type { ProtocolTaskId } from "@/types/models";

export const useTasks = () => {
  const recordsByDay = useTaskStore((state) => state.recordsByDay);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const getTodayRecords = useTaskStore((state) => state.getTodayRecords);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = globalThis.setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => globalThis.clearInterval(timer);
  }, []);

  const todayRecords = getTodayRecords();
  const completion = AnalyticsService.completionPercentage(todayRecords);

  const tasks = useMemo(
    () =>
      DAILY_PROTOCOL_TASKS.map((task) => ({
        ...task,
        completed: todayRecords.find((item) => item.taskId === task.id)?.completed ?? false,
        isDisabled: (() => {
          const [hourString, minuteString] = task.dueTime.split(":");
          const dueAt = new Date(now);
          dueAt.setHours(Number(hourString), Number(minuteString), 0, 0);
          return now.getTime() >= dueAt.getTime();
        })()
      })),
    [todayRecords, now]
  );

  const streak = useMemo(() => AnalyticsService.streakFromDays(recordsByDay), [recordsByDay]);

  return {
    tasks,
    completion,
    streak,
    toggleTask: (taskId: ProtocolTaskId) => {
      const task = tasks.find((entry) => entry.id === taskId);
      if (!task || task.isDisabled) {
        return;
      }
      toggleTask(taskId);
    }
  };
};
