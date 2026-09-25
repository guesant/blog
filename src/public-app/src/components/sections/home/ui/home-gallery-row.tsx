import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { Box } from '../../../ui';

type HomeGalleryRowProps = {
  children: ReactNode;
  mode?: 'grid' | 'carousel' | 'list';
};

export function HomeGalleryRow(props: HomeGalleryRowProps) {
  let rowStyles: SxProps<Theme>;

  if (props.mode === 'carousel') {
    rowStyles = {
      display: 'grid',
      gridAutoColumns: { xs: '85%', sm: '48%', md: '32%' },
      gridAutoFlow: 'column',
      gap: 2,
      overflowX: 'auto',
      pb: 1,
    };
  } else if (props.mode === 'list') {
    rowStyles = {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 2,
    };
  } else {
    rowStyles = {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
      gap: 2,
    };
  }

  return <Box sx={rowStyles}>{props.children}</Box>;
}
