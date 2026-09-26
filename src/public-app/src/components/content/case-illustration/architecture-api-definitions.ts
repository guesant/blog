import type { IllustrationTranslator } from '@/i18n/compat-support';
import type { ArchitectureDiagramDefinition } from './architecture-diagram-element';
import type { ArchitectureDiagramTemplate } from './architecture-diagram-element';
import { resolveArchitectureDiagram } from './resolve-architecture-diagram';
import type { IllustrationAccent } from './types';

type CreateArchitectureApiDefinitionsOptions = {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

const architectureApiTemplate: ArchitectureDiagramTemplate[] = [
  {
    id: 'connector',
    element: {
      component: 'line',
      x1: '200',
      y1: '184',
      x2: '200',
      y2: '206',
      stroke: '@accent.line',
      strokeWidth: '1.5',
    },
  },
  {
    id: 'body',
    element: {
      component: 'rect',
      x: '96',
      y: '120',
      width: '208',
      height: '64',
      rx: '10',
      fill: '@accent.strongAlpha',
      stroke: '@accent.line',
    },
  },
  {
    id: 'label',
    element: {
      component: 'text',
      x: '200',
      y: '140',
      fontSize: '12',
      textAnchor: 'middle',
      fill: '@accent.strong',
    },
    content: '@label',
  },
];

export function createArchitectureApiDefinitions(
  options: CreateArchitectureApiDefinitionsOptions,
): ArchitectureDiagramDefinition[] {
  return resolveArchitectureDiagram(architectureApiTemplate, {
    accent: options.accent,
    label: options.t('api'),
  });
}
