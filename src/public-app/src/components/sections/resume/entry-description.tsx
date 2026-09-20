'use client';

import { Typography } from '../../ui';
import type { EntryDescriptionProps } from './types';

export function EntryDescription(props: EntryDescriptionProps) {
  if (!props.description?.trim()) {
    return null;
  }
  return (
    <Typography variant="body2" color="text.secondary" visualVariant="entryDescription">
      {props.description}
    </Typography>
  );
}
