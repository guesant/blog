import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeSectionSurfaceProps = {
  children: ReactNode;
  id: string;
  work?: boolean;
};

export function HomeSectionSurface(props: HomeSectionSurfaceProps) {
  return (
    <Box
      component="section"
      id={props.id}
      sx={{
        pt: props.work ? 'var(--site-space-6)' : 0,
        scrollMarginTop: '6rem',
      }}
    >
      {props.children}
    </Box>
  );
}
