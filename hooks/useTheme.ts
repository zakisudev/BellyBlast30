import { useSettingsStore } from "@/store/settingsStore";
import { useAppThemeContext } from "@/theme/ThemeProvider";

export const useTheme = () => {
  const { isDark } = useAppThemeContext();
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return {
    isDark,
    themeMode: settings.themeMode,
    setThemeMode: (mode: "light" | "dark" | "system") =>
      updateSettings({
        themeMode: mode
      })
  };
};
