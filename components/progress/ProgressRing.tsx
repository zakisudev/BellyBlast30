import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useEffect } from "react";
import { Text, useTheme } from "react-native-paper";

import type { AppTheme } from "@/theme/paper";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  size?: number;
  progress: number;
  label: string;
}

export const ProgressRing = ({ size = 160, progress, label }: ProgressRingProps) => {
  const theme = useTheme<AppTheme>();
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const animated = useSharedValue(0);

  useEffect(() => {
    animated.value = withTiming(progress, {
      duration: 500,
      easing: Easing.out(Easing.cubic)
    });
  }, [animated, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animated.value)
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.dark ? "#2B394A" : "#DDE7E5"}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.dark ? "#73E8D2" : "#0A9A80"}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>
          {Math.round(progress * 100)}%
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  center: {
    position: "absolute",
    alignItems: "center"
  }
});
