import { Pressable, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
}

export const GradientButton = ({ label, onPress }: GradientButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={["#11897C", "#30B8A6", "#2E8EE1"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        <Text variant="titleMedium" style={styles.label}>
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#0F5B66",
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5
    },
    elevation: 6
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  },
  gradient: {
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 11,
    alignItems: "center"
  },
  label: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.3
  }
});
