import type { RichTextNode, ContentRichTextProps } from './types';
import { Box } from '../../ui';
import { RichTextChildren } from './rich-text-children';
import { PlainTextRichText } from './plain-text-rich-text';

export function ContentRichText(props: ContentRichTextProps) {
  if (typeof props.content === 'string') {
    return <PlainTextRichText content={props.content} />;
  }

  const { content } = props;

  const root = content as RichTextNode | undefined;

  return (
    <Box visualVariant="richTextContent">
      <RichTextChildren nodes={root?.children} />
    </Box>
  );
}
