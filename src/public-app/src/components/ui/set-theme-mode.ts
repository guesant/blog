import type { Dispatch, SetStateAction } from 'react';
import type { ThemeMode } from '@portfolio/data/config/theme';

export function setThemeMode(
  setModeState: Dispatch<SetStateAction<ThemeMode>>,
  nextMode: ThemeMode,
) {
  if (nextMode === 'system') {
    document.documentElement.removeAttribute('data-theme');
    document.cookie = 'site-theme=; Path=/; Max-Age=0; SameSite=Lax';
  } else {
    document.documentElement.dataset.theme = nextMode;
    document.cookie = 'site-theme=' + nextMode + '; Path=/; Max-Age=31536000; SameSite=Lax';
  }
  setModeState(nextMode);
}
