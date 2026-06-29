import type { ProtocolTask } from "@/types/models";

export const DEFAULT_WATER_GOAL_ML = 2200;

export const DAILY_PROTOCOL_TASKS: ProtocolTask[] = [
  {
    id: "morning_sunlight_high_knees",
    title: "Morning Sunlight + High Knees",
    description:
      "Get natural sunlight exposure and complete a short high-knees burst to activate metabolism.",
    dueTime: "08:00",
    notificationTitle: "Morning Activation",
    notificationBody: "Catch sunlight and do your high knees to prime the day."
  },
  {
    id: "fast_until_noon",
    title: "Fast Until Noon",
    description: "Maintain your fasting window until noon and stay hydrated.",
    dueTime: "12:00",
    notificationTitle: "Fasting Window",
    notificationBody: "You are close. Hold the fast until noon."
  },
  {
    id: "protein_meal",
    title: "Protein Meal",
    description: "Prioritize a protein-forward meal to support satiety and recovery.",
    dueTime: "13:00",
    notificationTitle: "Protein Check",
    notificationBody: "Build your meal around quality protein."
  },
  {
    id: "apple_cider_vinegar",
    title: "Apple Cider Vinegar",
    description: "Take your planned ACV serving before a meal if approved by your clinician.",
    dueTime: "16:00",
    notificationTitle: "ACV Reminder",
    notificationBody: "Time for your apple cider vinegar routine."
  },
  {
    id: "evening_hiit",
    title: "Evening HIIT",
    description: "Finish a short high-intensity interval training session.",
    dueTime: "19:30",
    notificationTitle: "Evening HIIT",
    notificationBody: "Your quick HIIT block is waiting."
  },
  {
    id: "sleep_before_11",
    title: "Sleep Before 11 PM",
    description: "Set up wind-down rituals and get into bed before 11 PM.",
    dueTime: "22:30",
    notificationTitle: "Wind Down",
    notificationBody: "Protect recovery. Begin your sleep routine now."
  }
];

export const WATER_QUICK_ADD_OPTIONS_ML = [250, 500, 750] as const;
