import "react-native-gesture-handler";
import "react-native-reanimated";

import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useSegments } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text, useTheme } from "react-native-paper";

import { GlobalFeedbackSnackbar } from "@/components/common/GlobalFeedbackSnackbar";
import { ONBOARDING_COMPLETED_KEY, isOnboardingCompletedInSession } from "@/constants/onboarding";
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
  const [onboardingStatus, setOnboardingStatus] = useState<"checking" | "pending" | "complete">(
    "checking"
  );

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)
      .then((value) => {
        if (mounted) {
          setOnboardingStatus(
            value === "true" || isOnboardingCompletedInSession() ? "complete" : "pending"
          );
        }
      })
      .catch(() => {
        if (mounted) {
          setOnboardingStatus(isOnboardingCompletedInSession() ? "complete" : "pending");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading || onboardingStatus === "checking") {
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
    const inOnboarding = firstSegment === "onboarding";

    if (!user && onboardingStatus === "pending") {
      if (inOnboarding) {
        return;
      }

      AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)
        .then((value) => {
          if (value === "true" || isOnboardingCompletedInSession()) {
            setOnboardingStatus("complete");
            router.replace("/login" as never);
            return;
          }

          router.replace("/onboarding" as never);
        })
        .catch(() => {
          if (isOnboardingCompletedInSession()) {
            setOnboardingStatus("complete");
            router.replace("/login" as never);
            return;
          }

          router.replace("/onboarding" as never);
        });
      return;
    }

    if (!user && !inAuthGroup) {
      router.replace("/login" as never);
      return;
    }

    if (user && (inAuthGroup || inOnboarding)) {
      router.replace("/(tabs)" as never);
    }
  }, [loading, onboardingStatus, router, segments, user]);

  if (loading || onboardingStatus === "checking") {
    return <BootScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
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
