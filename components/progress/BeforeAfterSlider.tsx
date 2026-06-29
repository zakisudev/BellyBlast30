import { useMemo, useRef } from "react";
import type { LayoutChangeEvent } from "react-native";
import { Image, PanResponder, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { GlassCard } from "@/components/ui/GlassCard";

interface BeforeAfterSliderProps {
  beforeUri: string;
  afterUri: string;
  beforeLabel: string;
  afterLabel: string;
}

const IMAGE_HEIGHT = 260;

export const BeforeAfterSlider = ({
  beforeUri,
  afterUri,
  beforeLabel,
  afterLabel
}: BeforeAfterSliderProps) => {
  const width = useSharedValue(1);
  const dividerX = useSharedValue(0.5);
  const startRatioRef = useRef(0.5);

  const onLayout = (event: LayoutChangeEvent) => {
    width.value = Math.max(1, event.nativeEvent.layout.width);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      startRatioRef.current = dividerX.value;
    },
    onPanResponderMove: (_, gestureState) => {
      const next = startRatioRef.current + gestureState.dx / width.value;
      dividerX.value = Math.min(0.95, Math.max(0.05, next));
    }
  });

  const clipStyle = useAnimatedStyle(() => ({
    width: width.value * dividerX.value
  }));

  const dividerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: width.value * dividerX.value - 1 }]
  }));

  const labelText = useMemo(() => `${beforeLabel} vs ${afterLabel}`, [afterLabel, beforeLabel]);

  return (
    <GlassCard>
      <Text variant="titleMedium">Before / After</Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        Drag the slider to compare progress photos ({labelText}).
      </Text>
      <View onLayout={onLayout} style={styles.frame}>
        <Image source={{ uri: beforeUri }} style={styles.image} resizeMode="cover" />
        <Animated.View style={[styles.overlay, clipStyle]}>
          <Image source={{ uri: afterUri }} style={styles.image} resizeMode="cover" />
        </Animated.View>
        <Animated.View style={[styles.divider, dividerStyle]} {...panResponder.panHandlers}>
          <View style={styles.knob} />
        </Animated.View>
        <View style={styles.tagRow} pointerEvents="none">
          <Text variant="labelSmall" style={styles.tag}>
            {beforeLabel}
          </Text>
          <Text variant="labelSmall" style={styles.tag}>
            {afterLabel}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    opacity: 0.75,
    marginTop: 4,
    marginBottom: 10
  },
  frame: {
    height: IMAGE_HEIGHT,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative"
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: IMAGE_HEIGHT,
    overflow: "hidden"
  },
  divider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#FFFFFFE6",
    alignItems: "center",
    justifyContent: "center"
  },
  knob: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#0F8977"
  },
  tagRow: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  tag: {
    color: "#FFFFFF",
    backgroundColor: "#00000066",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999
  }
});
