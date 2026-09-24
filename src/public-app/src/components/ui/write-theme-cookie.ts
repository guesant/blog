import type { ResolvedThemeMode, ThemeMode } from '@portfolio/data/config/theme';

export function writeThemeCookie(mode: ThemeMode, resolvedMode: ResolvedThemeMode): void {
  const value = mode === 'system' ? 'system.' + resolvedMode : mode;

  document.cookie = 'site-theme=' + value + '; Path=/; Max-Age=31536000; SameSite=Lax';
}
