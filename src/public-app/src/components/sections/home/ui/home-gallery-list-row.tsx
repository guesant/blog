import type { ReactNode } from 'react';
import { Box } from '../../../ui';

export type HomeGalleryListRowProps = { children: ReactNode };

export function HomeGalleryListRow(props: HomeGalleryListRowProps) {
  return (
    <Box
      sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--site-page-content-offset)' }}
    >
      {props.children}
    </Box>
  );
}
