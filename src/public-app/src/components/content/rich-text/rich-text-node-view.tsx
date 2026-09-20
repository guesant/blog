import { RichTextElement } from '../../ui';
import { ELEMENT_TAGS, NODE_RENDERERS, type RichTextNodeProps } from './types';
import { RichTextChildren } from './rich-text-children';

type RichTextNodeViewProps = RichTextNodeProps;

export function RichTextNodeView(props: RichTextNodeViewProps) {
  const { node } = props;

  const renderer = node.type ? NODE_RENDERERS[node.type] : undefined;

  if (renderer) {
    return renderer(node);
  }

  const Tag = node.type ? ELEMENT_TAGS[node.type] : undefined;

  if (!Tag) {
    return <RichTextChildren nodes={node.children} />;
  }
  return (
    <RichTextElement component={Tag}>{<RichTextChildren nodes={node.children} />}</RichTextElement>
  );
}
