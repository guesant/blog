'use client';

import { ResumeEntryGridFrame } from '../../ui';
import type { ResumeEntryGridProps } from './types';

export function ResumeEntryGrid(props: ResumeEntryGridProps) {
  return <ResumeEntryGridFrame>{props.children}</ResumeEntryGridFrame>;
}
