import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeGallerySectionsProps = {
  children: ReactNode;
};

export function HomeGallerySections(props: HomeGallerySectionsProps) {
  return (
    <Box
      sx={{
        '& > section + section': {
          borderTop: 'var(--site-border-width) solid var(--site-border)',
          paddingTop: 'var(--site-space-6)',
        },
      }}
    >
      {props.children}
    </Box>
  );
}
