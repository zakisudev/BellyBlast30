import * as Device from "expo-device";

import { DAILY_PROTOCOL_TASKS } from "@/constants/protocol";
import { StorageService } from "@/services/StorageService";
import type { ServiceResult } from "@/types/models";

const NOTIFICATION_TZ_KEY = "bb30_notifications_timezone";

let notificationsReady = false;

const loadNotifications = async () => {
  const Notifications = await import("expo-notifications");

  if (!notificationsReady) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false
      })
    });
    notificationsReady = true;
  }

  return Notifications;
};

export class NotificationService {
  static async requestPermission(): Promise<ServiceResult<boolean>> {
    try {
      if (!Device.isDevice) {
        return { ok: true, data: false };
      }

      const Notifications = await loadNotifications();

      const current = await Notifications.getPermissionsAsync();
      let granted =
        current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

      if (!granted) {
        const asked = await Notifications.requestPermissionsAsync();
        granted =
          asked.granted || asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
      }

      return { ok: true, data: granted };
    } catch {
      return {
        ok: false,
        error: {
          code: "notification_error",
          message: "Unable to request notification permission."
        }
      };
    }
  }

  static async rescheduleDailyProtocol(): Promise<ServiceResult<number>> {
    try {
      const Notifications = await loadNotifications();

      await Notifications.cancelAllScheduledNotificationsAsync();

      let scheduledCount = 0;

      for (const task of DAILY_PROTOCOL_TASKS) {
        const [hourString, minuteString] = task.dueTime.split(":");
        const hour = Number(hourString);
        const minute = Number(minuteString);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: task.notificationTitle,
            body: task.notificationBody,
            sound: "default"
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute
          }
        });

        scheduledCount += 1;
      }

      return { ok: true, data: scheduledCount };
    } catch {
      return {
        ok: false,
        error: {
          code: "notification_error",
          message: "Unable to schedule reminders."
        }
      };
    }
  }

  static async syncForTimezone(currentTimezone: string): Promise<ServiceResult<boolean>> {
    const permission = await NotificationService.requestPermission();
    if (!permission.ok) {
      return {
        ok: false,
        error: permission.error
      };
    }

    if (!permission.data) {
      return { ok: true, data: false };
    }

    const timezoneResult = await StorageService.getItem<string>(NOTIFICATION_TZ_KEY);
    if (!timezoneResult.ok) {
      return {
        ok: false,
        error: timezoneResult.error
      };
    }

    const needsReschedule = timezoneResult.data !== currentTimezone;
    if (!needsReschedule) {
      return { ok: true, data: false };
    }

    const scheduled = await NotificationService.rescheduleDailyProtocol();
    if (!scheduled.ok) {
      return {
        ok: false,
        error: scheduled.error
      };
    }

    const saved = await StorageService.setItem(NOTIFICATION_TZ_KEY, currentTimezone);
    if (!saved.ok) {
      return {
        ok: false,
        error: saved.error
      };
    }

    return { ok: true, data: true };
  }
}
