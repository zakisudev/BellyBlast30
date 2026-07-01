import "react-native-gesture-handler";
import "react-native-reanimated";

import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useSegments } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text, useTheme } from "react-native-paper";

import { GlobalFeedbackSnackbar } from "@/components/common/GlobalFeedbackSnackbar";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useNotificationBootstrap } from "@/hooks/useNotificationBootstrap";
import { AppThemeProvider } from "@/theme/ThemeProvider";
import type { AppTheme } from "@/theme/paper";

const queryClient = new QueryClient();

export default function RootLayout() {
  useNotificationBootstrap();

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </AuthProvider>
        <GlobalFeedbackSnackbar />
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    const firstSegment = segments[0] as string | undefined;
    const secondSegment = segments[1] as string | undefined;
    const inAuthGroup =
      firstSegment === "(auth)" ||
      firstSegment === "login" ||
      firstSegment === "signup" ||
      secondSegment === "login" ||
      secondSegment === "signup";

    if (!user && !inAuthGroup) {
      router.replace("/login" as never);
      return;
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)" as never);
    }
  }, [loading, router, segments, user]);

  if (loading) {
    return <BootScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" options={{ headerShown: true, title: "Not Found" }} />
    </Stack>
  );
}

function BootScreen() {
  const theme = useTheme<AppTheme>();

  return (
    <View style={styles.bootContainer}>
      <LinearGradient
        colors={theme.dark ? ["#061018", "#0B1620", "#111C28"] : ["#E8F7F4", "#EEF6FF", "#FFF8F1"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.bootContent}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="titleMedium" style={[styles.bootText, theme.dark && styles.bootTextDark]}>
          Preparing your session
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  bootContent: {
    alignItems: "center",
    gap: 16,
    padding: 24
  },
  bootText: {
    fontWeight: "700"
  },
  bootTextDark: {
    color: "#EAF2F7"
  }
});
