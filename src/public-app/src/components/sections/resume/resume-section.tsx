'use client';

import { ResumeSectionFrame } from '../../ui';
import type { ResumeSectionProps } from './types';

export function ResumeSection(props: ResumeSectionProps) {
  return <ResumeSectionFrame title={props.title} children={props.children} />;
}
