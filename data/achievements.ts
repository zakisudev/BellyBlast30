import type { Achievement } from "@/types/models";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_day",
    title: "First Day",
    description: "Complete all six habits in one day.",
    icon: "rocket-launch",
    conditionType: "first_day",
    conditionValue: 1
  },
  {
    id: "streak_7",
    title: "7 Day Streak",
    description: "Complete protocol goals for seven days in a row.",
    icon: "fire",
    conditionType: "streak",
    conditionValue: 7
  },
  {
    id: "streak_14",
    title: "14 Day Streak",
    description: "Keep your streak alive for fourteen days.",
    icon: "flash",
    conditionType: "streak",
    conditionValue: 14
  },
  {
    id: "streak_30",
    title: "30 Day Streak",
    description: "Complete the full BellyBlast 30 streak.",
    icon: "trophy",
    conditionType: "streak",
    conditionValue: 30
  },
  {
    id: "perfect_week",
    title: "Perfect Week",
    description: "Record seven perfect protocol days in a row.",
    icon: "star",
    conditionType: "perfect_week",
    conditionValue: 7
  },
  {
    id: "hydration_master",
    title: "Hydration Master",
    description: "Hit your water goal for ten days.",
    icon: "cup-water",
    conditionType: "hydration_streak",
    conditionValue: 10
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete the morning habit before 8 AM for five days.",
    icon: "weather-sunny",
    conditionType: "time_based",
    conditionValue: 5
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Log sleep routine before 11 PM for ten nights.",
    icon: "weather-night",
    conditionType: "time_based",
    conditionValue: 10
  }
];
