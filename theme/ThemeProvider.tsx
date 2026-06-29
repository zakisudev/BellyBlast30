import { createContext, useContext, useMemo } from "react";
import type { PropsWithChildren } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";

import { darkTheme, lightTheme } from "@/theme/paper";
import { useSettingsStore } from "@/store/settingsStore";

interface ThemeContextValue {
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({ isDark: false });

export const AppThemeProvider = ({ children }: PropsWithChildren) => {
  const systemMode = useColorScheme();
  const mode = useSettingsStore((state) => state.settings.themeMode);

  const isDark = mode === "system" ? systemMode === "dark" : mode === "dark";

  const value = useMemo(() => ({ isDark }), [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={isDark ? darkTheme : lightTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useAppThemeContext = () => useContext(ThemeContext);
