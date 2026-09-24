import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeGalleryRowProps = {
  children: ReactNode;
  mode?: 'grid' | 'carousel';
};

export function HomeGalleryRow(props: HomeGalleryRowProps) {
  return (
    <Box
      sx={
        props.mode === 'carousel'
          ? {
              display: 'grid',
              gridAutoColumns: { xs: '85%', sm: '48%', md: '32%' },
              gridAutoFlow: 'column',
              gap: 2,
              overflowX: 'auto',
              pb: 1,
            }
          : {
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 2,
            }
      }
    >
      {props.children}
    </Box>
  );
}
