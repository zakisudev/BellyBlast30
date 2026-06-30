import type { PropsWithChildren } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";

import { GlassCard } from "@/components/ui/GlassCard";
import type { AppTheme } from "@/theme/paper";

interface AuthLayoutProps extends PropsWithChildren {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ eyebrow, title, subtitle, children }: AuthLayoutProps) => {
  const theme = useTheme<AppTheme>();

  const colors = theme.dark
    ? (["#061018", "#0B1620", "#111C28"] as const)
    : (["#E8F7F4", "#EEF6FF", "#FFF8F1"] as const);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="labelLarge" style={styles.eyebrow}>
            {eyebrow}
          </Text>
          <Text variant="displaySmall" style={[styles.title, theme.dark && styles.titleDark]}>
            {title}
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, theme.dark && styles.subtitleDark]}>
            {subtitle}
          </Text>
        </View>

        <GlassCard
          padding={18}
          tint={theme.dark ? "rgba(10, 20, 29, 0.84)" : "rgba(255, 255, 255, 0.74)"}
        >
          {children}
        </GlassCard>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 18
  },
  header: {
    gap: 10
  },
  eyebrow: {
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "#29AA97",
    fontWeight: "800"
  },
  title: {
    fontWeight: "900",
    lineHeight: 44,
    color: "#10212D"
  },
  titleDark: {
    color: "#ECF4F8"
  },
  subtitle: {
    maxWidth: 340,
    color: "#4B6578",
    lineHeight: 22
  },
  subtitleDark: {
    color: "#AEC1CF"
  },
  glowOne: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    top: 64,
    right: -52,
    backgroundColor: "rgba(79, 214, 197, 0.22)"
  },
  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    bottom: 36,
    left: -72,
    backgroundColor: "rgba(66, 145, 235, 0.16)"
  }
});
