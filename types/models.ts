export type ProtocolTaskId =
  | "morning_sunlight_high_knees"
  | "fast_until_noon"
  | "protein_meal"
  | "apple_cider_vinegar"
  | "evening_hiit"
  | "sleep_before_11";

export interface ProtocolTask {
  id: ProtocolTaskId;
  title: string;
  description: string;
  dueTime: string;
  notificationTitle: string;
  notificationBody: string;
}

export interface DailyTaskRecord {
  taskId: ProtocolTaskId;
  completed: boolean;
  completedAt?: string;
}

export interface DailyProgress {
  date: string;
  tasks: DailyTaskRecord[];
  waterOz: number;
  notes?: string;
}

export interface MeasurementEntry {
  date: string;
  weightKg: number;
  waistCm: number;
  bodyFatPct?: number;
  note?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  uri: string;
  source: "camera" | "gallery";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionType: "first_day" | "streak" | "perfect_week" | "hydration_streak" | "time_based";
  conditionValue: number;
}

export interface AchievementState {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AppSettings {
  themeMode: "light" | "dark" | "system";
  notificationsEnabled: boolean;
  waterGoalMl: number;
  weightUnit: "kg";
  timezone: string;
  dynamicColorAndroid: boolean;
}

export interface AppError {
  code:
    | "storage_error"
    | "permission_denied"
    | "notification_error"
    | "validation_error"
    | "unknown_error";
  message: string;
  context?: string;
}

export interface Result<T> {
  ok: true;
  data: T;
}

export interface Failure {
  ok: false;
  error: AppError;
}

export type ServiceResult<T> = Result<T> | Failure;
