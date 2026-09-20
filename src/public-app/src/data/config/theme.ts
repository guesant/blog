import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server';

export type ThemeMode = 'system' | 'light' | 'dark';

function parseThemeCookie(cookieHeader: string | undefined): ThemeMode {
  const value = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('site-theme='))
    ?.slice('site-theme='.length);

  return value === 'light' || value === 'dark' ? value : 'system';
}

export const loadThemeMode = createServerFn({ method: 'GET' }).handler(() => {
  setResponseHeader('Vary', 'Cookie');
  return parseThemeCookie(getRequestHeader('cookie'));
});
