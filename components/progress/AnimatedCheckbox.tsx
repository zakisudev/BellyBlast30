import { Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";
import { useTheme } from "react-native-paper";

interface AnimatedCheckboxProps {
  checked: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

export const AnimatedCheckbox = ({
  checked,
  onPress,
  accessibilityLabel
}: AnimatedCheckboxProps) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(checked ? 1.05 : 1, {
      damping: 10,
      stiffness: 180
    });
  }, [checked, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.hitTarget}
    >
      <Animated.View
        style={[
          styles.box,
          animatedStyle,
          {
            borderColor: checked ? theme.colors.primary : theme.colors.outline,
            backgroundColor: checked ? theme.colors.primary : "transparent"
          }
        ]}
      >
        {checked ? (
          <MaterialCommunityIcons name="check" size={18} color={theme.colors.onPrimary} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  hitTarget: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  }
});
