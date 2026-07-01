import { ScrollView, StyleSheet } from "react-native";
import { Text, useTheme as usePaperTheme } from "react-native-paper";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { PermissionBanner } from "@/components/common/PermissionBanner";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useHydration } from "@/hooks/useHydration";
import { useAppFeedback } from "@/hooks/useAppFeedback";
import { useNotifications } from "@/hooks/useNotifications";
import { usePermissions } from "@/hooks/usePermissions";
import { useScrollToTopOnFocus } from "@/hooks/useScrollToTopOnFocus";
import { useStorage } from "@/hooks/useStorage";
import { useTheme } from "@/hooks/useTheme";
import { BackupService } from "@/services/BackupService";
import { CSVService } from "@/services/CSVService";
import { NotificationService } from "@/services/NotificationService";
import { PDFService } from "@/services/PDFService";
import { useAchievementsStore } from "@/store/achievementsStore";
import { useHydrationStore } from "@/store/hydrationStore";
import { useProgressStore } from "@/store/progressStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useStatisticsStore } from "@/store/statisticsStore";
import { useTaskStore } from "@/store/taskStore";
import type { AppTheme } from "@/theme/paper";

export default function SettingsScreen() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const measurements = useProgressStore((state) => state.measurements);
  const photos = useProgressStore((state) => state.photos);
  const recordsByDay = useTaskStore((state) => state.recordsByDay);
  const hydrationEntriesByDay = useHydrationStore((state) => state.entriesByDay);
  const hydrationGoalMl = useHydrationStore((state) => state.goalMl);
  const achievements = useAchievementsStore((state) => state.achievements);
  const longestStreak = useStatisticsStore((state) => state.longestStreak);
  const currentStreak = useStatisticsStore((state) => state.currentStreak);
  const completionRate = useStatisticsStore((state) => state.completionRate);

  const { setGoal } = useHydration();
  const { showSuccess, showError, showInfo } = useAppFeedback();
  const { signOutUser } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { setupNotifications } = useNotifications();
  const { cameraGranted, libraryGranted, photoPermissionsChecked, requestPhotoPermissions } =
    usePermissions();
  const { clearAppStorage } = useStorage();
  const scrollRef = useRef<ScrollView>(null);
  const theme = usePaperTheme<AppTheme>();
  const [remindersLoading, setRemindersLoading] = useState(false);

  const handleReminderToggle = async (enabled: boolean) => {
    if (remindersLoading) {
      return;
    }

    setRemindersLoading(true);

    try {
      if (enabled) {
        const message = await setupNotifications();
        if (message.toLowerCase().includes("scheduled")) {
          updateSettings({ notificationsEnabled: true });
          showSuccess(message);
        } else {
          updateSettings({ notificationsEnabled: false });
          showError(message);
        }
        return;
      }

      const clearResult = await NotificationService.clearScheduledDailyProtocol();
      if (clearResult.ok) {
        updateSettings({ notificationsEnabled: false });
        showInfo("Daily reminders disabled.");
      } else {
        updateSettings({ notificationsEnabled: true });
        showError(clearResult.error.message);
      }
    } finally {
      setRemindersLoading(false);
    }
  };

  useScrollToTopOnFocus(scrollRef);
  const backgroundGradient = theme.dark
    ? (["#07101A", "#0D1823", "#111B27"] as const)
    : (["#E9F5FF", "#F0FBF7", "#F8F9FF"] as const);
  const photoPermissionsGranted = cameraGranted && libraryGranted;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient colors={backgroundGradient} style={StyleSheet.absoluteFill} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={[styles.title, theme.dark && styles.titleDark]}>
          Settings
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Notifications, theme, goals, exports, and backups.
        </Text>

        <Text variant="titleMedium" style={[styles.sectionTitle, theme.dark && styles.titleDark]}>
          Appearance
        </Text>
        <ThemeToggle mode={themeMode} onChange={setThemeMode} />

        <Text variant="titleMedium" style={[styles.sectionTitle, theme.dark && styles.titleDark]}>
          Preferences
        </Text>
        <GlassCard tint={theme.dark ? "#152536" : "#EAF4FF"}>
          <SettingsForm
            settings={settings}
            onSubmit={async (values) => {
              setGoal(values.waterGoalMl);
              showSuccess("Settings saved.");
            }}
          />
        </GlassCard>

        <Text variant="titleMedium" style={[styles.sectionTitle, theme.dark && styles.titleDark]}>
          Permissions
        </Text>
        <PermissionBanner
          title="Daily Reminders"
          description="Allow BellyBlast to schedule protocol reminders and re-sync after timezone changes."
          icon="bell-ring-outline"
          tone="teal"
          switchValue={settings.notificationsEnabled}
          switchLoading={remindersLoading}
          onToggleSwitch={handleReminderToggle}
        />
        {photoPermissionsChecked && !photoPermissionsGranted ? (
          <PermissionBanner
            title="Photos"
            description="Allow camera and media access to save progress photos."
            icon="camera-outline"
            actionLabel="Grant"
            tone="blue"
            onPress={async () => {
              const result = await requestPhotoPermissions();
              if (result.camera && result.library) {
                showSuccess("Camera and gallery permissions granted.");
              } else {
                showError("Some photo permissions were denied.");
              }
            }}
          />
        ) : null}

        <Text variant="titleMedium" style={[styles.sectionTitle, theme.dark && styles.titleDark]}>
          Data & Export
        </Text>
        <PermissionBanner
          title="Export PDF"
          description="Generate a visual summary report for your progress."
          icon="file-pdf-box"
          actionLabel="Export"
          tone="blue"
          onPress={async () => {
            const result = await PDFService.exportSummary("BellyBlast 30 Report", [
              `Completion focus: ${settings.waterGoalMl} ml hydration goal`,
              `Measurements entries: ${measurements.length}`
            ]);
            if (result.ok) {
              showSuccess("PDF exported.");
            } else {
              showError(result.error.message);
            }
          }}
        />
        <PermissionBanner
          title="Export CSV"
          description="Export your measurements for spreadsheet analysis."
          icon="file-delimited-outline"
          actionLabel="Export"
          tone="teal"
          onPress={async () => {
            const result = await CSVService.exportMeasurements(measurements);
            if (result.ok) {
              showSuccess("CSV exported.");
            } else {
              showError(result.error.message);
            }
          }}
        />
        <PermissionBanner
          title="Backup Data"
          description="Create a portable JSON backup of your current profile and logs."
          icon="cloud-upload-outline"
          actionLabel="Backup"
          tone="amber"
          onPress={async () => {
            const result = await BackupService.exportJson({
              exportedAt: new Date().toISOString(),
              settings,
              tasks: { recordsByDay },
              hydration: {
                goalMl: settings.waterGoalMl || hydrationGoalMl,
                entriesByDay: hydrationEntriesByDay
              },
              progress: {
                measurements,
                photos
              },
              achievements,
              statistics: {
                longestStreak,
                currentStreak,
                completionRate
              }
            });
            if (result.ok) {
              showSuccess("Backup shared.");
            } else {
              showError(result.error.message);
            }
          }}
        />
        <PermissionBanner
          title="Reset Progress"
          description="Clear local app data and start your 30-day protocol over."
          icon="restore-alert"
          actionLabel="Reset"
          tone="blue"
          onPress={async () => {
            const message = await clearAppStorage();
            showInfo(message);
          }}
        />
        <PermissionBanner
          title="Sign Out"
          description="End your Firebase session on this device and return to the login screen."
          icon="account-arrow-right-outline"
          actionLabel="Sign out"
          tone="amber"
          onPress={async () => {
            await signOutUser();
            showInfo("Signed out.");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontWeight: "800"
  },
  titleDark: {
    color: "#EAF2F7"
  },
  content: {
    padding: 18,
    paddingBottom: 120
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 12,
    opacity: 0.75,
    lineHeight: 20
  },
  heroLabel: {
    opacity: 0.72,
    textTransform: "uppercase",
    letterSpacing: 0.35
  },
  heroTitle: {
    marginTop: 4,
    fontWeight: "800"
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 10
  }
});
