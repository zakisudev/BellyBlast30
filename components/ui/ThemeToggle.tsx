import { StyleSheet, View } from "react-native";
import { SegmentedButtons, useTheme } from "react-native-paper";

import type { AppTheme } from "@/theme/paper";

interface ThemeToggleProps {
  mode: "light" | "dark" | "system";
  onChange: (mode: "light" | "dark" | "system") => void;
}

export const ThemeToggle = ({ mode, onChange }: ThemeToggleProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.dark ? "#142635" : "#E7F2FA"
        }
      ]}
    >
      <SegmentedButtons
        value={mode}
        onValueChange={(value) => onChange(value as "light" | "dark" | "system")}
        buttons={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "system", label: "System" }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    padding: 8,
    marginBottom: 4
  }
});
