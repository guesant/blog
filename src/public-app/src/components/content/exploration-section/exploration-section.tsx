import type { ExplorationSectionProps } from './types';
import { EditorialSectionLayout } from '../editorial-section-layout';

export function ExplorationSection(props: ExplorationSectionProps) {
  return (
    <EditorialSectionLayout
      id={props.id}
      title={props.title}
      description={props.description}
      divider={props.divider}
      titleVisualVariant={!props.divider ? 'explorationTitle' : undefined}
      descriptionVisualVariant="explorationSection"
    >
      {props.children}
    </EditorialSectionLayout>
  );
}
