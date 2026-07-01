import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import type { AppTheme } from "@/theme/paper";

interface GlassCardProps extends PropsWithChildren {
  padding?: number;
  tint?: string;
  borderColor?: string;
}

export const GlassCard = ({ children, padding = 16, tint, borderColor }: GlassCardProps) => {
  const theme = useTheme<AppTheme>();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: tint ?? `${theme.colors.surface}D9`,
          borderColor: borderColor ?? `${theme.colors.onSurface}1A`,
          padding
        }
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 26,
    shadowColor: "#08111D",
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 10
    },
    elevation: 8,
    marginBottom: 12
  }
});
