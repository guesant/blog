import type { Dispatch, SetStateAction } from 'react';
import type { ResolvedThemeMode, ThemeMode } from '@portfolio/data/config/theme';
import { writeThemeCookie } from './write-theme-cookie';

export function setThemeMode(
  setModeState: Dispatch<SetStateAction<ThemeMode>>,
  resolvedSystemMode: ResolvedThemeMode,
  nextMode: ThemeMode,
): void {
  const resolvedMode = nextMode === 'system' ? resolvedSystemMode : nextMode;

  document.documentElement.dataset.theme = resolvedMode;
  writeThemeCookie(nextMode, resolvedMode);
  setModeState(nextMode);
}
