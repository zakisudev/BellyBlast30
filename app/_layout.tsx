import "react-native-gesture-handler";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useNotificationBootstrap } from "@/hooks/useNotificationBootstrap";
import { AppThemeProvider } from "@/theme/ThemeProvider";

const queryClient = new QueryClient();

export default function RootLayout() {
  useNotificationBootstrap();

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" options={{ headerShown: true, title: "Not Found" }} />
        </Stack>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
