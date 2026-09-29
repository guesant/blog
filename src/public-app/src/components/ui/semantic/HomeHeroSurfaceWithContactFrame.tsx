import type { ComponentProps } from 'react';
import { Box } from '../box';

type HomeHeroSurfaceWithContactFrameProps = ComponentProps<typeof Box>;

export function HomeHeroSurfaceWithContactFrame(props: HomeHeroSurfaceWithContactFrameProps) {
  const Component = Box;

  return (
    <Component
      {...props}
      sx={[
        {
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
        },
        props.sx ?? {},
      ]}
    />
  );
}
