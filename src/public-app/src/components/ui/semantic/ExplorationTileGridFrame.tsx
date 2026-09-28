import type { ComponentProps } from 'react';
import { Box } from '../box';

type ExplorationTileGridFrameProps = ComponentProps<typeof Box>;

export function ExplorationTileGridFrame(props: ExplorationTileGridFrameProps) {
  const Component = Box;

  return (
    <Component
      {...props}
      sx={[
        {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          rowGap: 'var(--site-gap-stack)',
          columnGap: 'var(--site-gap-cluster)',
          mt: 'var(--site-space-4)',
          '& > *, & [data-exploration-item]': {
            flex: {
              xs: '0 0 calc((100% - var(--site-space-3)) / 2)',
              sm: '0 0 calc((100% - (var(--site-space-3) * 3)) / 4)',
            },
            minWidth: 0,
          },
        },
        props.sx ?? {},
      ]}
    />
  );
}
