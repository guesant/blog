import { Box } from '../../ui';
import type { ExplorationSectionProps } from './types';
import { ExplorationSectionHeader } from './exploration-section-header';

export function ExplorationSection(props: ExplorationSectionProps) {
  return (
    <Box
      component="section"
      id={props.id}
      visualVariant={props.divider ? 'explorationSection' : 'explorationSectionSpaced'}
    >
      <ExplorationSectionHeader
        title={props.title}
        description={props.description}
        divider={props.divider}
      />
      {props.children}
    </Box>
  );
}
