import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeProjectSummaryProps = {
  children: ReactNode;
};

export function HomeProjectSummary(props: HomeProjectSummaryProps) {
  return (
    <Box
      sx={{
        mt: 3,
        pt: 2.5,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        justifyContent: 'space-between',
      }}
    >
      {props.children}
    </Box>
  );
}
