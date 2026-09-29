import type { ReactNode } from 'react';
import { ExplorationTileGridFrame } from '../../ui/semantic/ExplorationTileGridFrame';

type ExplorationTileGridProps = {
  children: ReactNode;
};

export function ExplorationTileGrid(props: ExplorationTileGridProps) {
  return <ExplorationTileGridFrame>{props.children}</ExplorationTileGridFrame>;
}
