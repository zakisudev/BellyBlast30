import { useCallback, useState } from "react";

import { NotificationService } from "@/services/NotificationService";

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string>("");

  const setupNotifications = useCallback(async () => {
    setLoading(true);

    const permission = await NotificationService.requestPermission();
    if (!permission.ok || !permission.data) {
      setStatusText("Permission denied or unavailable on simulator.");
      setLoading(false);
      return;
    }

    const scheduled = await NotificationService.rescheduleDailyProtocol();
    if (!scheduled.ok) {
      setStatusText(scheduled.error.message);
      setLoading(false);
      return;
    }

    setStatusText(`Scheduled ${scheduled.data} reminders.`);
    setLoading(false);
  }, []);

  return {
    loading,
    statusText,
    setupNotifications
  };
};
