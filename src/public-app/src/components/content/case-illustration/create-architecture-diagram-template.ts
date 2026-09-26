import type { ArchitectureDiagramTemplate } from './architecture-diagram-element';

export type ArchitectureDiagramTemplateOptions = {
  body: Record<string, string>;
  connector: Record<string, string>;
  firstId: string;
  label: Record<string, string>;
};

export function createArchitectureDiagramTemplate(
  options: ArchitectureDiagramTemplateOptions,
): ArchitectureDiagramTemplate[] {
  return [
    { id: options.firstId, element: options.connector },
    { id: 'body', element: options.body },
    {
      id: 'label',
      element: { component: 'text', ...options.label, fill: '@accent.strong' },
      content: '@label',
    },
  ];
}
