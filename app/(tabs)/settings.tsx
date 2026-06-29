import { ScrollView, StyleSheet } from "react-native";
import { Snackbar, Text, useTheme as usePaperTheme } from "react-native-paper";
import { useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { PermissionBanner } from "@/components/common/PermissionBanner";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useNotifications } from "@/hooks/useNotifications";
import { useScrollToTopOnFocus } from "@/hooks/useScrollToTopOnFocus";
import { useStorage } from "@/hooks/useStorage";
import { useTheme } from "@/hooks/useTheme";
import { BackupService } from "@/services/BackupService";
import { CSVService } from "@/services/CSVService";
import { PDFService } from "@/services/PDFService";
import { useProgressStore } from "@/store/progressStore";
import { useSettingsStore } from "@/store/settingsStore";
import type { AppTheme } from "@/theme/paper";

export default function SettingsScreen() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const measurements = useProgressStore((state) => state.measurements);

  const { themeMode, setThemeMode } = useTheme();
  const { setupNotifications, statusText } = useNotifications();
  const { clearAppStorage } = useStorage();
  const scrollRef = useRef<ScrollView>(null);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const theme = usePaperTheme<AppTheme>();

  useScrollToTopOnFocus(scrollRef);
  const backgroundGradient = theme.dark
    ? (["#07101A", "#0D1823", "#111B27"] as const)
    : (["#E9F5FF", "#F0FBF7", "#F8F9FF"] as const);

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

        <GlassCard tint={theme.dark ? "#152739" : "#E3F1FF"}>
          <Text variant="labelLarge" style={styles.heroLabel}>
            Control Center
          </Text>
          <Text variant="titleLarge" style={[styles.heroTitle, theme.dark && styles.titleDark]}>
            Keep your protocol synced and secure
          </Text>
        </GlassCard>

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
            onSubmit={(values) => {
              updateSettings(values);
              setSnackbarMessage("Settings saved.");
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
          actionLabel="Configure"
          tone="teal"
          onPress={async () => {
            await setupNotifications();
            setSnackbarMessage(statusText || "Reminder setup complete.");
          }}
        />

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
            setSnackbarMessage(result.ok ? "PDF exported." : result.error.message);
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
            setSnackbarMessage(result.ok ? "CSV exported." : result.error.message);
          }}
        />
        <PermissionBanner
          title="Backup Data"
          description="Create a portable JSON backup of your current profile and logs."
          icon="cloud-upload-outline"
          actionLabel="Backup"
          tone="amber"
          onPress={async () => {
            const result = await BackupService.exportJson({ settings, measurements });
            setSnackbarMessage(result.ok ? "Backup shared." : result.error.message);
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
            setSnackbarMessage(message);
          }}
        />

        <Snackbar visible={Boolean(snackbarMessage)} onDismiss={() => setSnackbarMessage("")}>
          {snackbarMessage}
        </Snackbar>
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
