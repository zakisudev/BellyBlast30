import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, type ColorValue } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppTheme } from "@/theme/paper";

interface TabIconProps {
  name: ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: ColorValue;
  size: number;
  focused: boolean;
  theme: AppTheme;
}

const TabIcon = ({ name, color, size, focused, theme }: TabIconProps) => (
  <View
    style={[
      styles.iconShell,
      focused && [
        styles.iconShellActive,
        {
          backgroundColor: theme.dark ? "rgba(9, 17, 25, 0.12)" : "rgba(255, 255, 255, 0.12)",
          borderColor: theme.dark ? "rgba(9, 17, 25, 0.2)" : "rgba(255, 255, 255, 0.24)"
        }
      ]
    ]}
  >
    <MaterialCommunityIcons name={name} color={color} size={size} />
  </View>
);

export default function TabsLayout() {
  const theme = useTheme<AppTheme>();
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, 8);
  const activeTint = theme.dark ? "#0D2635" : "#F0F7FC";
  const inactiveTint = theme.dark ? "#325068" : "#9EB5C7";
  const tabGradient = theme.dark
    ? (["rgba(240, 248, 255, 0.97)", "rgba(221, 236, 247, 0.94)"] as const)
    : (["rgba(12, 25, 36, 0.96)", "rgba(17, 31, 45, 0.92)"] as const);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          position: "absolute",
          marginHorizontal: 16,
          marginBottom: bottomOffset,
          borderRadius: 28,
          height: 78,
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 8,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.dark ? "rgba(115, 146, 170, 0.42)" : "rgba(188, 215, 236, 0.32)",
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: theme.dark ? "#9ABCD4" : "#020A11",
          shadowOpacity: theme.dark ? 0.2 : 0.4,
          shadowOffset: { width: 0, height: 10 },
          shadowRadius: 16,
          overflow: "hidden"
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={tabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarItemStyle: {
          borderRadius: 20
        },
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 11,
          letterSpacing: 0.3,
          textTransform: "uppercase"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="home-variant"
              color={color}
              size={size}
              focused={focused}
              theme={theme}
            />
          )
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="chart-line" color={color} size={size} focused={focused} theme={theme} />
          )
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="calendar-month"
              color={color}
              size={size}
              focused={focused}
              theme={theme}
            />
          )
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="chart-timeline-variant"
              color={color}
              size={size}
              focused={focused}
              theme={theme}
            />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="cog" color={color} size={size} focused={focused} theme={theme} />
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconShell: {
    minWidth: 42,
    height: 34,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent"
  },
  iconShellActive: {
    transform: [{ translateY: -1 }]
  }
});
