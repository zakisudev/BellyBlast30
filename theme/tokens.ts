export const tokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    pill: 999
  },
  elevation: {
    low: 2,
    medium: 6,
    high: 10
  },
  motion: {
    quick: 180,
    normal: 280,
    slow: 400
  }
} as const;

export type Tokens = typeof tokens;
