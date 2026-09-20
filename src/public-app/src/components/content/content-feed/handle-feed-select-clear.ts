import type { MouseEvent } from 'react';

export function handleFeedSelectClear(
  onChange: (value: string) => void,
  clearValue: string,
  event: MouseEvent<HTMLButtonElement>,
) {
  event.stopPropagation();
  onChange(clearValue);
}
