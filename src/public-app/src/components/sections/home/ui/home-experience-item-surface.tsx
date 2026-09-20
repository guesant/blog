import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeExperienceItemSurfaceProps = {
  children: ReactNode;
};

export function HomeExperienceItemSurface(props: HomeExperienceItemSurfaceProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '9rem minmax(0, 1fr)' },
        gap: { xs: 1.25, sm: 4 },
        py: { xs: 3, md: 3.5 },
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {props.children}
    </Box>
  );
}
