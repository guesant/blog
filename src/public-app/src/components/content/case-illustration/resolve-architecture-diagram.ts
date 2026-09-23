import type { SvgElementProps } from '../../ui';
import type {
  ArchitectureDiagramDefinition,
  ArchitectureDiagramTemplate,
} from './architecture-diagram-element';
import type { IllustrationAccent } from './types';

type ResolveArchitectureDiagramOptions = {
  accent: IllustrationAccent;
  label: string;
};

export function resolveArchitectureDiagram(
  template: ArchitectureDiagramTemplate[],
  options: ResolveArchitectureDiagramOptions,
): ArchitectureDiagramDefinition[] {
  const replacements = {
    '@accent.line': options.accent.line,
    '@accent.strong': options.accent.strong,
    '@accent.strongAlpha': `${options.accent.strong}18`,
    '@label': options.label,
  };

  return template.map((definition) => {
    const attributes = Object.fromEntries(
      Object.entries(definition.element).map(([name, value]) => [
        name,
        replacements[value as keyof typeof replacements] ?? value,
      ]),
    ) as Record<string, string>;

    return {
      id: definition.id,
      element: {
        ...attributes,
        component: definition.element.component as SvgElementProps['component'],
      },
      content: definition.content
        ? (replacements[definition.content as keyof typeof replacements] ?? definition.content)
        : undefined,
    };
  });
}
