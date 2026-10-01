import type { ComponentProps } from 'react';
import { Box } from '../box';

export const explorationTileGridGapProperty = '--site-exploration-tile-grid-gap' as const;

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
          [explorationTileGridGapProperty]: 'var(--site-exploration-grid-gap)',
          rowGap: `var(${explorationTileGridGapProperty})`,
          columnGap: `var(${explorationTileGridGapProperty})`,
          mt: 0,
          '& > *, & [data-exploration-item]': {
            flex: {
              xs: `0 0 calc((100% - var(${explorationTileGridGapProperty})) / 2)`,
              sm: `0 0 calc((100% - (var(${explorationTileGridGapProperty}) * 3)) / 4)`,
            },
            minWidth: 0,
          },
        },
        props.sx ?? {},
      ]}
    />
  );
}
