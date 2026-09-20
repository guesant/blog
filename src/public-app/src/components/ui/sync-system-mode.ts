import type { Dispatch, SetStateAction } from 'react';
import type { ResolvedThemeMode } from './create-site-theme';

export function syncSystemMode(
  setSystemMode: Dispatch<SetStateAction<ResolvedThemeMode>>,
  media: MediaQueryList,
) {
  setSystemMode(media.matches ? 'dark' : 'light');
}
