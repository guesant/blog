'use client';

import { ResumeEntryCollectionFrame } from '../../ui';
import type { ResumeEntriesProps } from './types';

export function ResumeEntries<Item extends { name: string; period: string }>(
  props: ResumeEntriesProps<Item>,
) {
  return <ResumeEntryCollectionFrame>{props.items.map(props.children)}</ResumeEntryCollectionFrame>;
}
