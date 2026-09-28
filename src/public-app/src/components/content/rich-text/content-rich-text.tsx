import type { RichTextNode, ContentRichTextProps } from './types';
import { RichTextChildren } from './rich-text-children';
import { PlainTextRichText } from './plain-text-rich-text';
import { RichTextContentFrame } from '../../ui/semantic/RichTextContentFrame';

export function ContentRichText(props: ContentRichTextProps) {
  if (typeof props.content === 'string') {
    return <PlainTextRichText content={props.content} />;
  }

  const { content } = props;

  const root = content as RichTextNode | undefined;

  return (
    <RichTextContentFrame>
      <RichTextChildren nodes={root?.children} />
    </RichTextContentFrame>
  );
}
