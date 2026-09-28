import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeRecommendationListFrameProps = { children: ReactNode };

const listStyles = { display: 'grid', gap: 3 };

export function ResumeRecommendationListFrame(props: ResumeRecommendationListFrameProps) {
  return <Box sx={listStyles}>{props.children}</Box>;
}
