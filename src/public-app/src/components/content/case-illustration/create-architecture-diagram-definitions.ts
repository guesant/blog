import type {
  ArchitectureDiagramDefinition,
  ArchitectureDiagramTemplate,
} from './architecture-diagram-element';
import { resolveArchitectureDiagram } from './resolve-architecture-diagram';
import type { IllustrationAccent } from './types';

export type CreateArchitectureDiagramDefinitionsOptions = {
  accent: IllustrationAccent;
  label: string;
  template: ArchitectureDiagramTemplate[];
};

export function createArchitectureDiagramDefinitions(
  options: CreateArchitectureDiagramDefinitionsOptions,
): ArchitectureDiagramDefinition[] {
  return resolveArchitectureDiagram(options.template, {
    accent: options.accent,
    label: options.label,
  });
}
