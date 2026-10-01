import Markdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { RichTextFlowFrame } from '../../ui/semantic/RichTextFlowFrame';
import { markdownComponents } from './markdown-components';

type MarkdownRichTextProps = {
  content: string;
};

export function MarkdownRichText(props: MarkdownRichTextProps) {
  return (
    <RichTextFlowFrame>
      <Markdown
        components={markdownComponents}
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
      >
        {props.content}
      </Markdown>
    </RichTextFlowFrame>
  );
}
