import { StyleSheet } from "react-native";
import { Snackbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useFeedbackStore } from "@/store/feedbackStore";

export const GlobalFeedbackSnackbar = () => {
  const insets = useSafeAreaInsets();
  const visible = useFeedbackStore((state) => state.visible);
  const message = useFeedbackStore((state) => state.message);
  const tone = useFeedbackStore((state) => state.tone);
  const hide = useFeedbackStore((state) => state.hide);

  const backgroundColor = tone === "success" ? "#1F7A4D" : tone === "error" ? "#A23C3C" : "#2B4E73";

  return (
    <Snackbar
      visible={visible}
      onDismiss={hide}
      duration={3200}
      wrapperStyle={[styles.wrapper, { top: insets.top + 8 }]}
      style={[styles.snackbar, { backgroundColor }]}
      action={{
        label: "Dismiss",
        onPress: hide
      }}
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0
  },
  snackbar: {
    marginHorizontal: 12
  }
});
