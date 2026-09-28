'use client';

import { ResumeEntryDescription } from '../../ui';
import type { EntryDescriptionProps } from './types';

export function EntryDescription(props: EntryDescriptionProps) {
  if (!props.description?.trim()) {
    return null;
  }
  return <ResumeEntryDescription>{props.description}</ResumeEntryDescription>;
}
