import { Box } from '../../ui';
import type { ReactNode } from 'react';

type ExplorationTileGridProps = { children: ReactNode };

export function ExplorationTileGrid(props: ExplorationTileGridProps) {
  return <Box visualVariant="explorationTileGrid">{props.children}</Box>;
}
