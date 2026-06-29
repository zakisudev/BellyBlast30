import { MD3DarkTheme, MD3LightTheme, configureFonts } from "react-native-paper";

const fonts = configureFonts({ isV3: true });

export const lightTheme = {
  ...MD3LightTheme,
  fonts,
  roundness: 28,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#0D8576",
    secondary: "#2394B7",
    tertiary: "#D48744",
    error: "#B64057",
    surface: "#F8FBFD",
    surfaceVariant: "#E6EFF4",
    background: "#EEF4FA",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onSurface: "#15232C",
    outline: "#A3B3BF"
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  fonts,
  roundness: 28,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#58D1C1",
    secondary: "#67C7EB",
    tertiary: "#F1B57A",
    error: "#FF8195",
    surface: "#101C27",
    surfaceVariant: "#1A2936",
    background: "#091119",
    onPrimary: "#032A27",
    onSecondary: "#032635",
    onSurface: "#EAF2F7",
    outline: "#8093A3"
  }
};

export type AppTheme = typeof lightTheme;
