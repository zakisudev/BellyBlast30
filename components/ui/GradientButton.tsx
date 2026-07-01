import { Pressable, StyleSheet } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

interface GradientButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  showLoadingOnPress?: boolean;
  minLoadingMs?: number;
}

const wait = (ms: number) => new Promise<void>((resolve) => globalThis.setTimeout(resolve, ms));

export const GradientButton = ({
  label,
  onPress,
  disabled = false,
  showLoadingOnPress = true,
  minLoadingMs = 350
}: GradientButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (disabled || loading) {
      return;
    }

    if (!showLoadingOnPress) {
      await Promise.resolve(onPress());
      return;
    }

    setLoading(true);
    const startedAt = Date.now();

    try {
      await Promise.resolve(onPress());
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < minLoadingMs) {
        await wait(minLoadingMs - elapsed);
      }
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={() => {
        void handlePress();
      }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        pressed && !loading && styles.pressed,
        (disabled || loading) && styles.disabled
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      <LinearGradient
        colors={["#11897C", "#30B8A6", "#2E8EE1"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        {loading ? <ActivityIndicator color="#fff" size="small" /> : null}
        {!loading ? (
          <Text variant="titleMedium" style={styles.label}>
            {label}
          </Text>
        ) : null}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 5,
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
  disabled: {
    opacity: 0.78
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
