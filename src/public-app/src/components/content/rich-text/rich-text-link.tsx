import { RichTextElement } from '../../ui';
import { safeUrl, type RichTextNodeProps } from './types';
import { RichTextChildren } from './rich-text-children';

type RichTextLinkProps = RichTextNodeProps;

export function RichTextLink(props: RichTextLinkProps) {
  const { node } = props;

  const href = safeUrl(node.url);

  if (!href) {
    return <RichTextChildren nodes={node.children} />;
  }
  return (
    <RichTextElement component="a" href={href} title={node.title}>
      <RichTextChildren nodes={node.children} />
    </RichTextElement>
  );
}
