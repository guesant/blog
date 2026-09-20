import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type PortfolioProjectGridProps = {
  children: ReactNode;
};

export function PortfolioProjectGrid(props: PortfolioProjectGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: 'var(--site-space-4)',
      }}
    >
      {props.children}
    </Box>
  );
}
