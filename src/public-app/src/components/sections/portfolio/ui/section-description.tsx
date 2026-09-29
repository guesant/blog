import type { ReactNode } from 'react';
import { Typography } from '../../../ui';

type PortfolioSectionDescriptionProps = {
  children: ReactNode;
};

export function PortfolioSectionDescription(props: PortfolioSectionDescriptionProps) {
  return (
    <Typography
      color="text.secondary"
      sx={{
        mb: 'var(--site-space-3)',
        width: '100%',
        maxWidth: '100%',
        marginInline: 'auto',
        textAlign: 'center',
      }}
    >
      {props.children}
    </Typography>
  );
}
