import { Pressable, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Text, useTheme } from "react-native-paper";

import { AnimatedCheckbox } from "@/components/progress/AnimatedCheckbox";
import { GlassCard } from "@/components/ui/GlassCard";
import type { AppTheme } from "@/theme/paper";

interface TaskCardProps {
  title: string;
  description: string;
  dueTime: string;
  completed: boolean;
  disabled?: boolean;
  onToggle: () => void;
  tint?: string;
}

export const TaskCard = ({
  title,
  description,
  dueTime,
  completed,
  disabled = false,
  onToggle,
  tint
}: TaskCardProps) => {
  const theme = useTheme<AppTheme>();

  const toggle = async () => {
    if (disabled) {
      return;
    }

    await Haptics.selectionAsync();
    onToggle();
  };

  return (
    <Animated.View entering={FadeInRight.duration(220)}>
      <Pressable
        onPress={toggle}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed, disabled }}
      >
        <GlassCard padding={18} tint={tint}>
          <View
            style={[styles.row, completed && styles.rowCompleted, disabled && styles.rowDisabled]}
          >
            <View
              style={[
                styles.accentRail,
                { backgroundColor: completed ? "#42B97F" : theme.colors.primary }
              ]}
            />
            <View style={styles.content}>
              <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
                {title}
              </Text>
              <Text
                variant="bodySmall"
                style={[styles.description, { color: theme.colors.onSurface }]}
              >
                {description}
              </Text>
              <Text variant="labelSmall" style={[styles.time, { color: theme.colors.onSurface }]}>
                {disabled ? `Window closed at ${dueTime}` : `Due ${dueTime}`}
              </Text>
            </View>
            <AnimatedCheckbox
              checked={completed}
              onPress={toggle}
              accessibilityLabel={`Toggle ${title}`}
            />
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rowCompleted: {
    opacity: 0.94
  },
  rowDisabled: {
    opacity: 0.3
  },
  accentRail: {
    width: 5,
    height: "100%",
    borderRadius: 8,
    marginRight: 12
  },
  content: {
    flex: 1,
    gap: 7,
    paddingRight: 12
  },
  title: {
    fontWeight: "700"
  },
  description: {
    opacity: 0.82,
    lineHeight: 18
  },
  time: {
    opacity: 0.64,
    letterSpacing: 0.2
  }
});
