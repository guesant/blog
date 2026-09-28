import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeTrajectoryHighlightsFrameProps = { children: ReactNode };

const highlightsStyles = {
  display: 'grid',
  gap: 'var(--site-space-1)',
  margin: 0,
  paddingInlineStart: 'var(--site-space-9)',
  color: 'var(--site-text-secondary)',
};

export function ResumeTrajectoryHighlightsFrame(props: ResumeTrajectoryHighlightsFrameProps) {
  return (
    <Box component="ul" sx={highlightsStyles}>
      {props.children}
    </Box>
  );
}
