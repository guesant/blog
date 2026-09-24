import type { MouseEvent } from 'react';
import type { ContentFeedDisplayMode } from './types';

export function handleFeedDisplayModeChange(
  onChange: (value: ContentFeedDisplayMode) => void,
  _event: MouseEvent<HTMLElement>,
  value: ContentFeedDisplayMode | null,
) {
  if (value) {
    onChange(value);
  }
}
