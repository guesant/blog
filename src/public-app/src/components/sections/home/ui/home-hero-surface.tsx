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
      visualVariant={props.showContact ? 'homeHeroSurfaceWithContact' : 'homeHeroSurface'}
    >
      {props.children}
    </Box>
  );
}
