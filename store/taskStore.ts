import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DAILY_PROTOCOL_TASKS } from "@/constants/protocol";
import { APP_STORAGE_KEYS, jsonStorage } from "@/store/persist";
import type { DailyTaskRecord, ProtocolTaskId } from "@/types/models";
import { todayISO } from "@/utils/date";

interface TaskState {
  recordsByDay: Record<string, DailyTaskRecord[]>;
  toggleTask: (taskId: ProtocolTaskId) => void;
  resetDay: (date: string) => void;
  getTodayRecords: () => DailyTaskRecord[];
}

const taskById = Object.fromEntries(DAILY_PROTOCOL_TASKS.map((task) => [task.id, task])) as Record<
  ProtocolTaskId,
  (typeof DAILY_PROTOCOL_TASKS)[number]
>;

const isTaskPastDue = (taskId: ProtocolTaskId, now: Date): boolean => {
  const task = taskById[taskId];
  const [hourString, minuteString] = task.dueTime.split(":");
  const dueAt = new Date(now);
  dueAt.setHours(Number(hourString), Number(minuteString), 0, 0);
  return now.getTime() >= dueAt.getTime();
};

const createDefaultDay = (): DailyTaskRecord[] =>
  DAILY_PROTOCOL_TASKS.map((task) => ({
    taskId: task.id,
    completed: false
  }));

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      recordsByDay: {},
      toggleTask: (taskId) => {
        if (isTaskPastDue(taskId, new Date())) {
          return;
        }

        const date = todayISO();
        const current = get().recordsByDay[date] ?? createDefaultDay();
        const next = current.map((record) => {
          if (record.taskId !== taskId) return record;
          const completed = !record.completed;
          return {
            ...record,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined
          };
        });

        set((state) => ({
          recordsByDay: {
            ...state.recordsByDay,
            [date]: next
          }
        }));
      },
      resetDay: (date) => {
        set((state) => ({
          recordsByDay: {
            ...state.recordsByDay,
            [date]: createDefaultDay()
          }
        }));
      },
      getTodayRecords: () => {
        const date = todayISO();
        return get().recordsByDay[date] ?? createDefaultDay();
      }
    }),
    {
      name: APP_STORAGE_KEYS.tasks,
      storage: jsonStorage,
      version: 1,
      migrate: (persistedState) => persistedState as TaskState
    }
  )
);
