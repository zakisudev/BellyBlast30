import { useCallback, useState } from "react";

import { NotificationService } from "@/services/NotificationService";

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState<string>("");

  const setupNotifications = useCallback(async (): Promise<string> => {
    setLoading(true);

    const permission = await NotificationService.requestPermission();
    if (!permission.ok || !permission.data) {
      const message = "Permission denied or unavailable on simulator.";
      setStatusText(message);
      setLoading(false);
      return message;
    }

    const scheduled = await NotificationService.rescheduleDailyProtocol();
    if (!scheduled.ok) {
      const message = scheduled.error.message;
      setStatusText(message);
      setLoading(false);
      return message;
    }

    const message = `Scheduled ${scheduled.data} reminders.`;
    setStatusText(message);
    setLoading(false);
    return message;
  }, []);

  return {
    loading,
    statusText,
    setupNotifications
  };
};
