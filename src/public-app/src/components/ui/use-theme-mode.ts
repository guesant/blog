import { useContext } from 'react';
import { ThemeModeContext } from './theme-mode-context';

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeRegistry');
  }
  return context;
}
