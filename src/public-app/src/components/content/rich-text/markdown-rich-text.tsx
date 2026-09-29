import Markdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { RichTextContentFrame } from '../../ui/semantic/RichTextContentFrame';
import { markdownComponents } from './markdown-components';

type MarkdownRichTextProps = {
  content: string;
};

export function MarkdownRichText(props: MarkdownRichTextProps) {
  return (
    <RichTextContentFrame>
      <Markdown
        components={markdownComponents}
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
      >
        {props.content}
      </Markdown>
    </RichTextContentFrame>
  );
}
