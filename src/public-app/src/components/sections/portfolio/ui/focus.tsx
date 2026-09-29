import type { ReactNode } from 'react';
import { Typography } from '../../../ui';
import { editorialSubtitleStyles } from '../../../ui/editorial-typography';

type PortfolioFocusProps = {
  children: ReactNode;
};

export function PortfolioFocus(props: PortfolioFocusProps) {
  return (
    <Typography sx={{ ...editorialSubtitleStyles, mt: 'var(--site-space-1)', maxWidth: '68ch' }}>
      {props.children}
    </Typography>
  );
}
