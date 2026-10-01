import type { ReactNode } from 'react';
import { Box } from '../../../ui';

export type HomeGalleryCarouselRowProps = { children: ReactNode };

export function HomeGalleryCarouselRow(props: HomeGalleryCarouselRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoColumns: { xs: '85%', sm: '48%', md: '32%' },
        gridAutoFlow: 'column',
        gap: 'var(--site-gap-stack)',
        overflowX: 'auto',
        pb: 1,
      }}
    >
      {props.children}
    </Box>
  );
}
