'use client';

import { Box } from '../../ui';
import type { ResumeEntryGridProps } from './types';

export function ResumeEntryGrid(props: ResumeEntryGridProps) {
  return <Box visualVariant="resumeEntryGrid">{props.children}</Box>;
}
