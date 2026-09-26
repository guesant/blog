export type { ResolvedThemeMode } from '@portfolio/data/config/theme';

type ColorTuple = readonly [string, string, string, string];

type PaletteTokens = {
  background: readonly [string, string];
  text: readonly [string, string, string];
  divider: string;
  action: readonly [string, string, string, string, string, string];
};

const primaryColorTokens = [
  ['#1D4ED8', '#EEF3F8', '#163DA9', '#FFFFFF'],
  ['#6D97EF', '#17263C', '#8FB0F4', '#0B1120'],
] satisfies readonly [ColorTuple, ColorTuple];

const colorTokens = [
  primaryColorTokens,
  primaryColorTokens,
  [
    ['#146C43', '#D1E7DD', '#146C43', '#FFFFFF'],
    ['#85CF9E', '#143323', '#85CF9E', '#17181C'],
  ],
  [
    ['#997404', '#FFF3CD', '#997404', '#1A1A1A'],
    ['#E3C05A', '#3A2E0C', '#E3C05A', '#17181C'],
  ],
  [
    ['#B02A37', '#F8D7DA', '#B02A37', '#FFFFFF'],
    ['#F19891', '#3C1C1E', '#F19891', '#17181C'],
  ],
  [
    ['#087990', '#CFF4FC', '#087990', '#FFFFFF'],
    ['#7CD2E8', '#12303A', '#7CD2E8', '#17181C'],
  ],
] satisfies readonly (readonly [ColorTuple, ColorTuple])[];

const paletteTokens = {
  light: {
    background: ['#FFFFFF', '#FFFFFF'],
    text: ['#1A1A1A', '#6B6B6B', '#404040'],
    divider: '#E5E5E5',
    action: ['#1A1A1A', '#F7F7F7', '#EEF3F8', '#86B7FE', '#6B6B6B', '#F2F2F2'],
  },
  dark: {
    background: ['#17181C', '#17181C'],
    text: ['#EEF0F3', '#A1A6B0', '#C3C7D0'],
    divider: '#303339',
    action: ['#EEF0F3', '#24262C', '#17263C', '#3F68A8', '#A1A6B0', '#1E2025'],
  },
} satisfies Record<'light' | 'dark', PaletteTokens>;

const createPalette = (mode: keyof typeof paletteTokens) => {
  const tokens = paletteTokens[mode];

  const modeIndex = mode === 'light' ? 0 : 1;

  const [primary, secondary, success, warning, error, info] = colorTokens.map((colors) => {
    const [main, light, dark, contrastText] = colors[modeIndex];

    return { main, light, dark, contrastText };
  });

  const [backgroundDefault, backgroundPaper] = tokens.background;

  const [textPrimary, textSecondary, textDisabled] = tokens.text;

  const [active, hover, selected, focus, disabled, disabledBackground] = tokens.action;

  return {
    primary,
    secondary,
    success,
    warning,
    error,
    info,
    background: { default: backgroundDefault, paper: backgroundPaper },
    text: { primary: textPrimary, secondary: textSecondary, disabled: textDisabled },
    divider: tokens.divider,
    action: { active, hover, selected, focus, disabled, disabledBackground },
  };
};

export const lightPalette = createPalette('light');

export const darkPalette = createPalette('dark');
