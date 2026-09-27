import { Box } from '../../ui';
import type { ReactNode } from 'react';

type ExplorationTileGridProps = { children: ReactNode; visualVariant?: string };

export function ExplorationTileGrid(props: ExplorationTileGridProps) {
  return <Box visualVariant={props.visualVariant ?? 'explorationTileGrid'}>{props.children}</Box>;
}
