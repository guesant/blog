import type { RichTextChildrenProps } from './types';
import { RichTextNodeView } from './rich-text-node-view';

export function RichTextChildren(props: RichTextChildrenProps) {
  const { nodes } = props;

  return (nodes ?? []).map((node, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: AST nodes carry no stable identity
    <RichTextNodeView key={index} node={node} />
  ));
}
