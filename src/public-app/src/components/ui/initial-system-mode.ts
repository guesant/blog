import type { ResolvedThemeMode } from './create-site-theme';

const documentModes: Partial<Record<string, ResolvedThemeMode>> = {
  dark: 'dark',
  light: 'light',
};

export function initialSystemMode(fallback: ResolvedThemeMode = 'light'): ResolvedThemeMode {
  if (typeof document === 'undefined') {
    return fallback;
  }

  const mode = documentModes[String(document.documentElement.dataset.theme)];

  return mode || fallback;
}
