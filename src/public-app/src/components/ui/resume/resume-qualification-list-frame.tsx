import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeQualificationListFrameProps = { children: ReactNode };

const listStyles = { display: 'grid', gap: 1.25 };

export function ResumeQualificationListFrame(props: ResumeQualificationListFrameProps) {
  return <Box sx={listStyles}>{props.children}</Box>;
}
