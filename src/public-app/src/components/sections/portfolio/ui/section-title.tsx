import type { ReactNode } from 'react';
import { Typography } from '../../../ui';
import { editorialSectionTitleStyles } from '../../../ui/editorial-typography';

type PortfolioSectionTitleProps = {
  children: ReactNode;
};

export function PortfolioSectionTitle(props: PortfolioSectionTitleProps) {
  return (
    <Typography component="h2" variant="h2" sx={editorialSectionTitleStyles}>
      {props.children}
    </Typography>
  );
}
