import type { ContentFeedDisplayMode } from './types';

export function contentFeedDisplayMode(
  value: string | null,
  fallback: ContentFeedDisplayMode,
): ContentFeedDisplayMode {
  return value === 'infinite' || value === 'pagination' ? value : fallback;
}
