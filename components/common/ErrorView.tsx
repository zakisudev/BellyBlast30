import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface ErrorViewProps {
  message: string;
}

export const ErrorView = ({ message }: ErrorViewProps) => {
  return (
    <View style={styles.container}>
      <Icon source="alert-circle" size={28} color="#BF4452" />
      <Text variant="bodyLarge" style={styles.message}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFEDEE"
  },
  message: {
    color: "#8B2A35",
    flex: 1
  }
});
