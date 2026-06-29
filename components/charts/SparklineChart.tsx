import { View } from "react-native";
import { useTheme } from "react-native-paper";
import Svg, { Polyline } from "react-native-svg";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
}

export const SparklineChart = ({ data, width = 280, height = 80 }: SparklineChartProps) => {
  const theme = useTheme();

  if (data.length <= 1) {
    return <View style={{ height, width }} />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Svg width={width} height={height}>
      <Polyline points={points} fill="none" stroke={theme.colors.primary} strokeWidth={3} />
    </Svg>
  );
};
