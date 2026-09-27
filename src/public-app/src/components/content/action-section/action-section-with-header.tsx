import { ContentSection } from '../content-section';
import { ExplorationTileGrid } from '../exploration-section';
import type { ActionSectionProps } from './types';

type ActionSectionWithHeaderProps = ActionSectionProps & {
  title: string;
};

export function ActionSectionWithHeader(props: ActionSectionWithHeaderProps) {
  return (
    <ContentSection
      id={props.id}
      title={props.title}
      description={props.description}
      divider={props.divider}
    >
      <ExplorationTileGrid>{props.children}</ExplorationTileGrid>
    </ContentSection>
  );
}
