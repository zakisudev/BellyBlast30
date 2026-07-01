import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme as usePaperTheme } from "react-native-paper";
import { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
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
  const { user, signOutUser, updateDisplayName, updateUserPassword, deleteAccount } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const { setupNotifications } = useNotifications();
  const { cameraGranted, libraryGranted, photoPermissionsChecked, requestPhotoPermissions } =
    usePermissions();
  const { clearAppStorage } = useStorage();
  const scrollRef = useRef<ScrollView>(null);
  const theme = usePaperTheme<AppTheme>();
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const handleUpdateName = async () => {
    const trimmedName = displayName.trim();

    if (trimmedName.length < 2) {
      showError("Enter a name with at least 2 characters.");
      return;
    }

    setProfileLoading(true);
    try {
      await updateDisplayName(trimmedName);
      setDisplayName(trimmedName);
      showSuccess("Name updated.");
    } catch (error) {
      showError(getAuthMessage(error, "Unable to update your name."));
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      showError("Enter your current password first.");
      return;
    }

    if (nextPassword.length < 6) {
      showError("Firebase requires passwords to be at least 6 characters.");
      return;
    }

    if (nextPassword !== confirmPassword) {
      showError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      await updateUserPassword(currentPassword, nextPassword);
      setCurrentPassword("");
      setNextPassword("");
      setConfirmPassword("");
      showSuccess("Password updated.");
    } catch (error) {
      showError(getAuthMessage(error, "Unable to update your password."));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (deleteLoading) {
      return;
    }

    Alert.alert("Delete account?", "Are you sure you want to leave this amazing experience", [
      {
        text: "Stay",
        style: "cancel"
      },
      {
        text: "Continue",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Final confirmation",
            "This permanently deletes your Firebase account. Your sign-in access cannot be restored from this device.",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Delete account",
                style: "destructive",
                onPress: () => {
                  void confirmDeleteAccount();
                }
              }
            ]
          );
        }
      }
    ]);
  };

  const confirmDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await deleteAccount();
      showInfo("Account deleted.");
    } catch (error) {
      showError(getAuthMessage(error, "Unable to delete your account."));
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
  }, [user?.displayName]);

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
          Manage your account, preferences, exports, and app access.
        </Text>

        <SectionHeader
          title="Account"
          description="Keep your Firebase profile details current."
          dark={theme.dark}
        />
        <GlassCard tint={theme.dark ? "#152536" : "#EAF4FF"}>
          <View style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Profile
            </Text>
            <Text variant="bodySmall" style={styles.helperText}>
              Signed in as {user?.email ?? "your account"}.
            </Text>
            <TextInput
              mode="outlined"
              label="Display name"
              placeholder="Your name"
              autoCapitalize="words"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <GradientButton
              label={profileLoading ? "Saving..." : "Save name"}
              onPress={handleUpdateName}
              disabled={profileLoading}
            />
          </View>
        </GlassCard>
        <GlassCard tint={theme.dark ? "#182D2A" : "#E6F7F1"}>
          <View style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Security
            </Text>
            <Text variant="bodySmall" style={styles.helperText}>
              Password updates follow Firebase rules and require a recent email/password sign-in.
            </Text>
            <TextInput
              mode="outlined"
              label="Current password"
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              mode="outlined"
              label="New password"
              placeholder="Minimum 6 characters"
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
              value={nextPassword}
              onChangeText={setNextPassword}
            />
            <TextInput
              mode="outlined"
              label="Confirm new password"
              secureTextEntry
              autoCapitalize="none"
              textContentType="newPassword"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <GradientButton
              label={passwordLoading ? "Updating..." : "Update password"}
              onPress={handleUpdatePassword}
              disabled={passwordLoading}
            />
          </View>
        </GlassCard>

        <SectionHeader
          title="App Preferences"
          description="Tune the experience to match your routine."
          dark={theme.dark}
        />
        <ThemeToggle mode={themeMode} onChange={setThemeMode} />
        <GlassCard tint={theme.dark ? "#152536" : "#EAF4FF"}>
          <SettingsForm
            settings={settings}
            onSubmit={async (values) => {
              setGoal(values.waterGoalMl);
              showSuccess("Settings saved.");
            }}
          />
        </GlassCard>

        <SectionHeader
          title="Permissions"
          description="Control reminders, camera, and media access."
          dark={theme.dark}
        />
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

        <SectionHeader
          title="Data & Export"
          description="Take your progress with you or create a backup."
          dark={theme.dark}
        />
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
          description="Export your measurements for analysis."
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
          description="Create a portable backup of your current profile and logs."
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

        <SectionHeader
          title="Danger Zone"
          description="Irreversible account and local data actions."
          dark={theme.dark}
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

        <View style={styles.bottomAction}>
          <PermissionBanner
            title="Sign Out"
            description="Signout from this device"
            icon="account-arrow-right-outline"
            actionLabel="Sign out"
            tone="amber"
            onPress={async () => {
              await signOutUser();
              showInfo("Signed out.");
            }}
          />
        </View>

        <PermissionBanner
          title="Delete Account"
          description="Permanently remove your Account"
          icon="account-remove-outline"
          actionLabel={deleteLoading ? "Deleting..." : "Delete account"}
          tone="danger"
          onPress={handleDeleteAccount}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  description,
  dark
}: {
  title: string;
  description: string;
  dark: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="titleMedium" style={[styles.sectionTitle, dark && styles.titleDark]}>
        {title}
      </Text>
      <Text variant="bodySmall" style={styles.sectionDescription}>
        {description}
      </Text>
    </View>
  );
}

function getAuthMessage(error: unknown, fallback: string) {
  const code = (error as { code?: string }).code;

  switch (code) {
    case "auth/requires-recent-login":
      return "Firebase requires a recent sign-in for this action. Sign out, sign back in, and try again.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "The current password is incorrect.";
    case "auth/weak-password":
      return "Firebase requires passwords to be at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return error instanceof Error ? error.message : fallback;
  }
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
    marginBottom: 18,
    opacity: 0.75,
    lineHeight: 20
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    gap: 3
  },
  sectionTitle: {
    fontWeight: "800"
  },
  sectionDescription: {
    opacity: 0.68,
    lineHeight: 18
  },
  cardContent: {
    gap: 10
  },
  cardTitle: {
    fontWeight: "800"
  },
  helperText: {
    opacity: 0.72,
    lineHeight: 18,
    marginBottom: 2
  },
  bottomAction: {
    marginTop: 16
  }
});
