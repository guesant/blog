import { ArchitectureDiagramElement } from './architecture-diagram-element';
import type { ArchitectureDiagramDefinition } from './architecture-diagram-element';

type ArchitectureDiagramProps = {
  definitions: ArchitectureDiagramDefinition[];
};

export function ArchitectureDiagram(props: ArchitectureDiagramProps) {
  return props.definitions.map((definition) => (
    <ArchitectureDiagramElement key={definition.id} definition={definition} />
  ));
}
