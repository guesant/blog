import type { IllustrationTranslator } from '@/i18n/compat-support';
import type { ArchitectureDiagramDefinition } from './architecture-diagram-element';
import type { ArchitectureDiagramTemplate } from './architecture-diagram-element';
import { resolveArchitectureDiagram } from './resolve-architecture-diagram';
import type { IllustrationAccent } from './types';

type CreateArchitectureDataDefinitionsOptions = {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

const architectureDataTemplate: ArchitectureDiagramTemplate[] = [
  {
    id: 'top',
    element: {
      component: 'ellipse',
      cx: '200',
      cy: '216',
      rx: '52',
      ry: '12',
      fill: '@accent.strongAlpha',
      stroke: '@accent.line',
    },
  },
  {
    id: 'body',
    element: {
      component: 'path',
      d: 'M148 216v36a52 12 0 0 0 104 0v-36',
      fill: 'none',
      stroke: '@accent.line',
    },
  },
  {
    id: 'label',
    element: {
      component: 'text',
      x: '200',
      y: '238',
      fontSize: '12',
      textAnchor: 'middle',
      fill: '@accent.strong',
    },
    content: '@label',
  },
];

export function createArchitectureDataDefinitions(
  options: CreateArchitectureDataDefinitionsOptions,
): ArchitectureDiagramDefinition[] {
  return resolveArchitectureDiagram(architectureDataTemplate, {
    accent: options.accent,
    label: options.t('data'),
  });
}
