import { createArchitectureEllipse } from './create-architecture-ellipse';
import { createArchitectureLabel } from './create-architecture-label';
import { createArchitectureLine } from './create-architecture-line';
import { createArchitecturePath } from './create-architecture-path';
import { createArchitectureRect } from './create-architecture-rect';
import { createArchitectureDiagramTemplate } from './create-architecture-diagram-template';
import type { ArchitectureDiagramTemplate } from './architecture-diagram-element';

export type ArchitectureDiagramKind = 'api' | 'application' | 'data';

const architectureDiagramTemplateOptions = {
  api: {
    firstId: 'connector',
    connector: createArchitectureLine({ y1: '184', y2: '206' }),
    body: createArchitectureRect({
      fill: '@accent.strongAlpha',
      height: '64',
      width: '208',
      x: '96',
      y: '120',
    }),
    label: createArchitectureLabel({ fontSize: '12', y: '140' }),
  },
  application: {
    firstId: 'connector',
    connector: createArchitectureLine({ y1: '92', y2: '120' }),
    body: createArchitectureRect({
      fill: '#fff',
      height: '44',
      width: '160',
      x: '120',
      y: '48',
    }),
    label: createArchitectureLabel({ fontSize: '13', y: '75' }),
  },
  data: {
    firstId: 'top',
    connector: createArchitectureEllipse(),
    body: createArchitecturePath(),
    label: createArchitectureLabel({ fontSize: '12', y: '238' }),
  },
} satisfies Record<
  ArchitectureDiagramKind,
  {
    firstId: string;
    connector: Record<string, string>;
    body: Record<string, string>;
    label: Record<string, string>;
  }
>;

export function getArchitectureDiagramTemplate(
  kind: ArchitectureDiagramKind,
): ArchitectureDiagramTemplate[] {
  return createArchitectureDiagramTemplate(architectureDiagramTemplateOptions[kind]);
}
