import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Icon source="tray" size={36} />
      <Text variant="titleMedium">{title}</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 24
  },
  subtitle: {
    opacity: 0.7,
    textAlign: "center"
  }
});
