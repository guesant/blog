import type { ReactNode } from 'react';
import { Paper } from '../../../ui';

type PortfolioAvailabilityCardProps = {
  children: ReactNode;
};

export function PortfolioAvailabilityCard(props: PortfolioAvailabilityCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 'var(--site-space-2)', sm: 'var(--site-space-3)' },
        mb: { xs: 'var(--site-space-5)', md: 'var(--site-space-7)' },
      }}
    >
      {props.children}
    </Paper>
  );
}
