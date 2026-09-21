import type { ResolvedThemeMode } from './create-site-theme';

export function initialSystemMode(): ResolvedThemeMode {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}
