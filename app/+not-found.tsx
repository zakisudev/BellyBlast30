import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">This screen does not exist.</Text>
      <Link href="/(tabs)" asChild>
        <Button mode="contained" style={styles.button}>
          Go to Dashboard
        </Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  button: {
    marginTop: 16
  }
});
