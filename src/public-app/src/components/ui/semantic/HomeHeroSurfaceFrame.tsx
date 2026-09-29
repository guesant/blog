import type { ComponentProps } from 'react';
import { Box } from '../box';

type HomeHeroSurfaceFrameProps = ComponentProps<typeof Box>;

export function HomeHeroSurfaceFrame(props: HomeHeroSurfaceFrameProps) {
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
