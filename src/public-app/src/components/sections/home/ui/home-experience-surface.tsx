import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeExperienceSurfaceProps = {
  children: ReactNode;
};

export function HomeExperienceSurface(props: HomeExperienceSurfaceProps) {
  return (
    <Box
      sx={{
        mt: 4,
        py: 3,
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {props.children}
    </Box>
  );
}
