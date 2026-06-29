import { useEffect } from "react";
import { AppState } from "react-native";

import { NotificationService } from "@/services/NotificationService";
import { useSettingsStore } from "@/store/settingsStore";

export const useNotificationBootstrap = () => {
  const notificationsEnabled = useSettingsStore((state) => state.settings.notificationsEnabled);
  const timezone = useSettingsStore((state) => state.settings.timezone);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  useEffect(() => {
    if (!notificationsEnabled) {
      return;
    }

    const sync = async () => {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (zone !== timezone) {
        updateSettings({ timezone: zone });
      }
      await NotificationService.syncForTimezone(zone);
    };

    void sync();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void sync();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [notificationsEnabled, timezone, updateSettings]);
};
