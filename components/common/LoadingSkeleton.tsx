import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export const LoadingSkeleton = () => {
  return (
    <Animated.View entering={FadeIn.duration(250)} style={styles.wrap}>
      <View style={[styles.block, { width: "70%" }]} />
      <View style={[styles.block, { width: "95%" }]} />
      <View style={[styles.block, { width: "82%" }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#E7EFED"
  },
  block: {
    height: 12,
    borderRadius: 8,
    backgroundColor: "#D4DFDC"
  }
});
