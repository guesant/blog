import type { ReactNode } from 'react';
import { Typography } from '../../../ui';

type PortfolioSectionTitleProps = {
  children: ReactNode;
};

export function PortfolioSectionTitle(props: PortfolioSectionTitleProps) {
  return (
    <Typography
      component="h2"
      variant="h2"
      sx={{ mt: 'var(--site-space-1)', mb: 'var(--site-space-1)' }}
    >
      {props.children}
    </Typography>
  );
}
