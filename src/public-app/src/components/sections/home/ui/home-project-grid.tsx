import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeProjectGridProps = {
  children: ReactNode;
};

export function HomeProjectGrid(props: HomeProjectGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      {props.children}
    </Box>
  );
}
