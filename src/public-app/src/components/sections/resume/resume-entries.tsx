'use client';

import { Box } from '../../ui';
import type { ResumeEntriesProps } from './types';

export function ResumeEntries<Item extends { name: string; period: string }>(
  props: ResumeEntriesProps<Item>,
) {
  return <Box visualVariant="resumeEntries">{props.items.map(props.children)}</Box>;
}
