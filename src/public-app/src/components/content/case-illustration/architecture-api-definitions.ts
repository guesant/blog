import { createArchitectureDiagramDefinitions } from './create-architecture-diagram-definitions';
import type { ArchitectureDiagramOptions } from './architecture-diagram-options';
import { getArchitectureDiagramTemplate } from './architecture-diagram-templates';

export const createArchitectureApiDefinitions = (options: ArchitectureDiagramOptions) =>
  createArchitectureDiagramDefinitions({
    accent: options.accent,
    label: options.t('api'),
    template: getArchitectureDiagramTemplate('api'),
  });
