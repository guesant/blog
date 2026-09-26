import type { IllustrationTranslator } from '@/i18n/compat-support';
import type { ArchitectureDiagramDefinition } from './architecture-diagram-element';
import type { ArchitectureDiagramTemplate } from './architecture-diagram-element';
import { resolveArchitectureDiagram } from './resolve-architecture-diagram';
import type { IllustrationAccent } from './types';

type CreateArchitectureApplicationDefinitionsOptions = {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

const architectureApplicationTemplate: ArchitectureDiagramTemplate[] = [
  {
    id: 'connector',
    element: {
      component: 'line',
      x1: '200',
      y1: '92',
      x2: '200',
      y2: '120',
      stroke: '@accent.line',
      strokeWidth: '1.5',
    },
  },
  {
    id: 'body',
    element: {
      component: 'rect',
      x: '120',
      y: '48',
      width: '160',
      height: '44',
      rx: '10',
      fill: '#fff',
      stroke: '@accent.line',
    },
  },
  {
    id: 'label',
    element: {
      component: 'text',
      x: '200',
      y: '75',
      fontSize: '13',
      textAnchor: 'middle',
      fill: '@accent.strong',
    },
    content: '@label',
  },
];

export function createArchitectureApplicationDefinitions(
  options: CreateArchitectureApplicationDefinitionsOptions,
): ArchitectureDiagramDefinition[] {
  return resolveArchitectureDiagram(architectureApplicationTemplate, {
    accent: options.accent,
    label: options.t('application'),
  });
}
