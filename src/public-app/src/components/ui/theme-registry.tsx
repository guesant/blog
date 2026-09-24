'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ResolvedThemeMode, ThemeMode } from '@portfolio/data/config/theme';
import { createSiteTheme } from './create-site-theme';
import { initialSystemMode } from './initial-system-mode';
import { setThemeMode } from './set-theme-mode';
import { syncSystemMode } from './sync-system-mode';
import { ThemeModeContext } from './theme-mode-context';
import { ThemeRuntime } from './theme-runtime';
import { writeThemeCookie } from './write-theme-cookie';

export { useThemeMode } from './use-theme-mode';

type ThemeRegistryProps = {
  children: ReactNode;
  initialMode?: ThemeMode;
  initialResolvedMode?: ResolvedThemeMode;
};

export function ThemeRegistry(props: ThemeRegistryProps) {
  const { children } = props;

  const [mode, setModeState] = useState<ThemeMode>(props.initialMode ?? 'system');

  const [systemMode, setSystemMode] = useState<ResolvedThemeMode>(() =>
    initialSystemMode(props.initialResolvedMode),
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const listener = syncSystemMode.bind(null, setSystemMode, media);

    syncSystemMode(setSystemMode, media);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (mode === 'system') {
      document.documentElement.dataset.theme = systemMode;
      writeThemeCookie(mode, systemMode);
    }
  }, [mode, systemMode]);

  const setMode = setThemeMode.bind(null, setModeState, systemMode);

  const resolvedMode = mode === 'system' ? systemMode : mode;

  const theme = useMemo(() => createSiteTheme(resolvedMode), [resolvedMode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeRuntime theme={theme}>{children}</ThemeRuntime>
    </ThemeModeContext.Provider>
  );
}
