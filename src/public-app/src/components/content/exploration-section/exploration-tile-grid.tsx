import { ExplorationTileGridFrame } from '../../ui/semantic/ExplorationTileGridFrame';
import type { ReactNode } from 'react';

type ExplorationTileGridProps = { children: ReactNode };

export function ExplorationTileGrid(props: ExplorationTileGridProps) {
  return <ExplorationTileGridFrame>{props.children}</ExplorationTileGridFrame>;
}
