import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeTrajectoryHighlightsFrameProps = { children: ReactNode };

const highlightsStyles = {
  margin: 0,
  marginBlockStart: 'var(--site-space-1)',
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
