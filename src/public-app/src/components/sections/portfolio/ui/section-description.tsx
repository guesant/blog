import type { ReactNode } from 'react';
import { Typography } from '../../../ui';

type PortfolioSectionDescriptionProps = {
  children: ReactNode;
};

export function PortfolioSectionDescription(props: PortfolioSectionDescriptionProps) {
  return (
    <Typography color="text.secondary" sx={{ mb: 'var(--site-space-3)', maxWidth: '60ch' }}>
      {props.children}
    </Typography>
  );
}
