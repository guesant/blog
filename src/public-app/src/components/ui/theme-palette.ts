export type { ResolvedThemeMode } from '@portfolio/data/config/theme';

export const lightPalette = {
  primary: { main: '#1D4ED8', light: '#EEF3F8', dark: '#163DA9', contrastText: '#FFFFFF' },
  secondary: { main: '#1D4ED8', light: '#EEF3F8', dark: '#163DA9', contrastText: '#FFFFFF' },
  success: { main: '#146C43', light: '#D1E7DD', dark: '#146C43', contrastText: '#FFFFFF' },
  warning: { main: '#997404', light: '#FFF3CD', dark: '#997404', contrastText: '#1A1A1A' },
  error: { main: '#B02A37', light: '#F8D7DA', dark: '#B02A37', contrastText: '#FFFFFF' },
  info: { main: '#087990', light: '#CFF4FC', dark: '#087990', contrastText: '#FFFFFF' },
  background: { default: '#FFFFFF', paper: '#FFFFFF' },
  text: { primary: '#1A1A1A', secondary: '#6B6B6B', disabled: '#404040' },
  divider: '#E5E5E5',
  action: {
    active: '#1A1A1A',
    hover: '#F7F7F7',
    selected: '#EEF3F8',
    focus: '#86B7FE',
    disabled: '#6B6B6B',
    disabledBackground: '#F2F2F2',
  },
};

export const darkPalette = {
  primary: { main: '#6D97EF', light: '#17263C', dark: '#8FB0F4', contrastText: '#0B1120' },
  secondary: { main: '#6D97EF', light: '#17263C', dark: '#8FB0F4', contrastText: '#0B1120' },
  success: { main: '#85CF9E', light: '#143323', dark: '#85CF9E', contrastText: '#17181C' },
  warning: { main: '#E3C05A', light: '#3A2E0C', dark: '#E3C05A', contrastText: '#17181C' },
  error: { main: '#F19891', light: '#3C1C1E', dark: '#F19891', contrastText: '#17181C' },
  info: { main: '#7CD2E8', light: '#12303A', dark: '#7CD2E8', contrastText: '#17181C' },
  background: { default: '#17181C', paper: '#17181C' },
  text: { primary: '#EEF0F3', secondary: '#A1A6B0', disabled: '#C3C7D0' },
  divider: '#303339',
  action: {
    active: '#EEF0F3',
    hover: '#24262C',
    selected: '#17263C',
    focus: '#3F68A8',
    disabled: '#A1A6B0',
    disabledBackground: '#1E2025',
  },
};
