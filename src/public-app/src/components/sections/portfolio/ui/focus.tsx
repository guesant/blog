import type { ReactNode } from 'react';
import { Typography } from '../../../ui';

type PortfolioFocusProps = {
  children: ReactNode;
};

export function PortfolioFocus(props: PortfolioFocusProps) {
  return (
    <Typography color="text.secondary" sx={{ mt: 'var(--site-space-1)', maxWidth: '68ch' }}>
      {props.children}
    </Typography>
  );
}
