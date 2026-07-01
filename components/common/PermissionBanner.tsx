import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Icon, Switch, Text, useTheme } from "react-native-paper";

import { GradientButton } from "@/components/ui/GradientButton";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AppTheme } from "@/theme/paper";

interface PermissionBannerProps {
  title: string;
  description: string;
  onPress?: () => void | Promise<void>;
  actionLabel?: string;
  icon?: string;
  tone?: "teal" | "blue" | "amber" | "danger";
  switchValue?: boolean;
  onToggleSwitch?: (value: boolean) => void | Promise<void>;
  switchLoading?: boolean;
}

const toneTints = {
  teal: {
    light: "#DCF4EE",
    dark: "#18332C"
  },
  blue: {
    light: "#E0EEFF",
    dark: "#162C3D"
  },
  amber: {
    light: "#FCEFD7",
    dark: "#382C1C"
  },
  danger: {
    light: "#FDE8EC",
    dark: "#3A1A22"
  }
} as const;

export const PermissionBanner = ({
  title,
  description,
  onPress,
  actionLabel = "Open",
  icon,
  tone = "blue",
  switchValue,
  onToggleSwitch,
  switchLoading = false
}: PermissionBannerProps) => {
  const theme = useTheme<AppTheme>();
  const tint = theme.dark ? toneTints[tone].dark : toneTints[tone].light;
  const cardBorderColor =
    tone === "danger"
      ? theme.dark
        ? "rgba(255, 129, 149, 0.42)"
        : "rgba(182, 64, 87, 0.35)"
      : undefined;
  const showsSwitch = typeof switchValue === "boolean" && typeof onToggleSwitch === "function";

  return (
    <GlassCard tint={tint} borderColor={cardBorderColor}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            {icon ? <Icon source={icon} size={18} /> : null}
            <Text variant="titleMedium" style={styles.title}>
              {title}
            </Text>
          </View>
          {showsSwitch ? (
            <View style={styles.switchWrap}>
              {switchLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Switch
                  value={switchValue}
                  onValueChange={(value) => {
                    void onToggleSwitch?.(value);
                  }}
                  disabled={switchLoading}
                />
              )}
            </View>
          ) : null}
        </View>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {description}
        </Text>
        {!showsSwitch && onPress ? (
          <GradientButton
            label={actionLabel}
            onPress={onPress}
            variant={tone === "danger" ? "danger" : "default"}
          />
        ) : null}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1
  },
  switchWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  title: {
    fontWeight: "700"
  },
  subtitle: {
    opacity: 0.75
  }
});
