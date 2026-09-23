import { SvgElement, type SvgElementProps } from '../../ui';

export type ArchitectureDiagramDefinition = {
  id: string;
  element: SvgElementProps;
  content?: string;
};

export type ArchitectureDiagramTemplate = {
  id: string;
  element: Record<string, string>;
  content?: string;
};

type ArchitectureDiagramElementProps = {
  definition: ArchitectureDiagramDefinition;
};

export function ArchitectureDiagramElement(props: ArchitectureDiagramElementProps) {
  return <SvgElement {...props.definition.element}>{props.definition.content}</SvgElement>;
}
