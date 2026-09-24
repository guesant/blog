import { ExplorationTileGrid } from '../exploration-section';
import type { ActionSectionProps } from './types';

type ActionSectionGridProps = Pick<ActionSectionProps, 'children'>;

export function ActionSectionGrid(props: ActionSectionGridProps) {
  return <ExplorationTileGrid>{props.children}</ExplorationTileGrid>;
}
