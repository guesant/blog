import type { RichTextNode, ContentRichTextProps } from './types';
import { RichTextChildren } from './rich-text-children';

export function ContentRichText(props: ContentRichTextProps) {
  const { content } = props;

  const root = content as RichTextNode | undefined;

  return <RichTextChildren nodes={root?.children} />;
}
