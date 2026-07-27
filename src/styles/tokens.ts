export const color = {
  // Primary — Blue
  blue50: '#eff6ff',
  blue100: '#c8e0ff',
  blue300: '#7eb1f3',
  blue500: '#1779e1', // Primary
  blue700: '#004fa7',

  // Neutral
  neutral0: '#fbfcfd',
  neutral100: '#edeef0',
  neutral200: '#d6d7da',
  neutral400: '#8d8f92',
  neutral600: '#535559',
  neutral900: '#191b1d',

  // Border
  border: '#e6e8ea',

  // Text
  textPrimary: '#141619',
  textBody: '#393b3e',
  textCaption: '#6f7275',
  textMuted: '#606369',

  // Category accent
  category: {
    주식: '#64a1ee',
    채권: '#00b5c5',
    거시경제: '#ab8be3',
    파생상품: '#e47d6d',
    부동산: '#67b36a',
    회계: '#c3972a',
  },
} as const;

export const typography = {
  headline: {
    fontSize: '22px',
    fontWeight: 900,
    letterSpacing: '-0.22px',
    color: color.textPrimary,
  },
  subhead: {
    fontSize: '15px',
    fontWeight: 500,
    color: color.textPrimary,
  },
  body: {
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: 1.7,
    color: color.textBody,
  },
  caption: {
    fontSize: '12px',
    fontWeight: 500,
    color: color.textCaption,
  },
} as const;

export const radius = {
  sm: '10px',
  md: '16px',
  lg: '22px',
  full: '99px',
} as const;

export const shadow = {
  soft: '0px 4px 8px rgba(20, 30, 60, 0.08)',
} as const;

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
} as const;
