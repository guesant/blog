import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { Box } from '../../../ui';

type HomeGalleryRowProps = {
  children: ReactNode;
  mode?: 'carousel' | 'list';
};

export function HomeGalleryRow(props: HomeGalleryRowProps) {
  let rowStyles: SxProps<Theme>;

  if (props.mode === 'carousel') {
    rowStyles = {
      display: 'grid',
      gridAutoColumns: { xs: '85%', sm: '48%', md: '32%' },
      gridAutoFlow: 'column',
      gap: 'var(--site-gap-stack)',
      overflowX: 'auto',
      pb: 1,
    };
  } else {
    rowStyles = {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 'var(--site-page-content-offset)',
    };
  }

  return <Box sx={rowStyles}>{props.children}</Box>;
}
