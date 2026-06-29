import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import type { AppTheme } from "@/theme/paper";

type CellStatus = "complete" | "partial" | "missed";

interface CalendarCellProps {
  day: number;
  status: CellStatus;
  selected?: boolean;
  onPress: () => void;
}

const statusColor: Record<CellStatus, string> = {
  complete: "#34B58B",
  partial: "#E4A744",
  missed: "#D46A70"
};

export const CalendarCell = ({ day, status, selected = false, onPress }: CalendarCellProps) => {
  const theme = useTheme<AppTheme>();
  const tone = statusColor[status];
  const background = theme.dark ? `${tone}33` : `${tone}2A`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.cell,
          {
            backgroundColor: background,
            borderColor: selected ? tone : "transparent"
          }
        ]}
      >
        <Text variant="labelLarge" style={{ color: tone, fontWeight: selected ? "800" : "700" }}>
          {day}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: "14.2%",
    padding: 3
  },
  pressed: {
    transform: [{ scale: 0.97 }]
  },
  cell: {
    borderRadius: 15,
    height: 46,
    alignItems: "center",
    justifyContent: "center"
  }
});
