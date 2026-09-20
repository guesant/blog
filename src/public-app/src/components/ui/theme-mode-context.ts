import { createContext } from 'react';
import type { ThemeMode } from '@portfolio/data/config/theme';

export type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);
