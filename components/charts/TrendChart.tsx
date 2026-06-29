import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { Text, useTheme } from "react-native-paper";

import { GlassCard } from "@/components/ui/GlassCard";
import type { AppTheme } from "@/theme/paper";

interface TrendChartProps {
  title: string;
  points: number[];
  color: string;
}

const chartWidth = 300;
const chartHeight = 120;

const toPath = (points: number[]) => {
  if (points.length === 0) {
    return "";
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const spread = Math.max(max - min, 1);

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * chartWidth;
      const y = chartHeight - ((point - min) / spread) * chartHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

export const TrendChart = ({ title, points, color }: TrendChartProps) => {
  const theme = useTheme<AppTheme>();
  const path = toPath(points);
  const tint = theme.dark ? "#142333" : "#E7F2FA";

  return (
    <GlassCard tint={tint} padding={18}>
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      {points.length === 0 ? (
        <Text variant="bodyMedium" style={[styles.empty, { color: theme.colors.onSurface }]}>
          No data yet.
        </Text>
      ) : (
        <View style={styles.chartWrap}>
          <Svg
            width="100%"
            height={chartHeight + 20}
            viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
          >
            <Defs>
              <LinearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <Stop offset="100%" stopColor={color} stopOpacity="0.35" />
              </LinearGradient>
            </Defs>
            <Path
              d={path}
              fill="none"
              stroke="url(#strokeGradient)"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "700"
  },
  chartWrap: {
    marginTop: 12
  },
  empty: {
    marginTop: 8,
    opacity: 0.7
  }
});
