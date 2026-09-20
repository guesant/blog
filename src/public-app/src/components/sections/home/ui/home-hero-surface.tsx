import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeHeroSurfaceProps = {
  children: ReactNode;
  showContact: boolean;
};

export function HomeHeroSurface(props: HomeHeroSurfaceProps) {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        pt: 0,
        pb: props.showContact ? 0 : 'var(--site-space-6)',
      }}
    >
      {props.children}
    </Box>
  );
}
