import type { RichTextNode, ContentRichTextProps } from './types';
import { RichTextChildren } from './rich-text-children';
import { MarkdownRichText } from './markdown-rich-text';
import { RichTextFlowFrame } from '../../ui/semantic/RichTextFlowFrame';

export function ContentRichText(props: ContentRichTextProps) {
  if (typeof props.content === 'string') {
    return <MarkdownRichText content={props.content} />;
  }

  const { content } = props;

  const root = content as RichTextNode | undefined;

  return (
    <RichTextFlowFrame>
      <RichTextChildren nodes={root?.children} />
    </RichTextFlowFrame>
  );
}
