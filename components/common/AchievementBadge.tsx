import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from "react-native-reanimated";

import { GlassCard } from "@/components/ui/GlassCard";

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const AchievementBadge = ({ title, description, icon, unlocked }: AchievementBadgeProps) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (unlocked) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.08, { duration: 280 }), withTiming(1, { duration: 280 })),
        2,
        false
      );
    }
  }, [pulse, unlocked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }]
  }));

  return (
    <GlassCard>
      <View style={[styles.row, { opacity: unlocked ? 1 : 0.3 }]}>
        <Animated.View
          style={[styles.iconBubble, unlocked ? styles.unlocked : styles.locked, animatedStyle]}
        >
          <Icon source={icon} size={22} color={unlocked ? "#0C7A6A" : "#8B9896"} />
        </Animated.View>
        <View style={styles.content}>
          <Text variant="titleMedium">{title}</Text>
          <Text variant="bodySmall" style={styles.description}>
            {description}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center"
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  unlocked: {
    backgroundColor: "#D6EFE8"
  },
  locked: {
    backgroundColor: "#D6EFE8"
  },
  content: {
    flex: 1,
    gap: 4
  },
  description: {
    opacity: 0.7
  }
});
