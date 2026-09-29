import type { ReactNode } from 'react';
import { Typography } from '../../../ui';
import { editorialSubtitleStyles } from '../../../ui/editorial-typography';

type PortfolioSectionDescriptionProps = {
  children: ReactNode;
};

export function PortfolioSectionDescription(props: PortfolioSectionDescriptionProps) {
  return (
    <Typography sx={{ ...editorialSubtitleStyles, mb: 'var(--site-space-3)' }}>
      {props.children}
    </Typography>
  );
}
