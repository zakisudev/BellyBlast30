import { BaseRepository } from "@/services/repositories/BaseRepository";
import type { AppSettings } from "@/types/models";

const SETTINGS_KEY = "bb30_repo_settings";

const defaultSettings: AppSettings = {
  themeMode: "system",
  notificationsEnabled: true,
  waterGoalMl: 2200,
  weightUnit: "kg",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dynamicColorAndroid: true
};

class SettingsRepositoryImpl extends BaseRepository<AppSettings> {
  constructor() {
    super(SETTINGS_KEY, 1);
  }

  protected migrate(legacy: unknown): AppSettings {
    const partial = legacy as Partial<AppSettings>;
    return {
      ...defaultSettings,
      ...partial
    };
  }

  async get(): Promise<AppSettings> {
    const result = await this.read(defaultSettings);
    return result.ok ? result.data : defaultSettings;
  }
}

export const SettingsRepository = new SettingsRepositoryImpl();
