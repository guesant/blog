import type { JSX, ReactNode } from 'react';
import type { RichTextContent } from '@portfolio/data/domain/types';
import { RichTextElement } from '../../ui';
import { RichTextImage } from './rich-text-image';
import { RichTextLink } from './rich-text-link';
import { withMarks } from './with-marks';
import { isSafeRelativeUrl } from './is-safe-relative-url';
import { safeProtocolUrl } from './safe-protocol-url';

export type RichTextNode = {
  type?: string;
  children?: RichTextNode[];
  text?: string;
  value?: string;
  url?: string;
  title?: string;
  alt?: string;
  caption?: string;
  lang?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

export const ELEMENT_TAGS: Record<string, keyof JSX.IntrinsicElements> = {
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  lic: 'span',
  blockquote: 'blockquote',
  table: 'table',
  tr: 'tr',
  th: 'th',
  td: 'td',
};

export function safeUrl(url: string | undefined) {
  if (!url || isSafeRelativeUrl(url)) {
    return url;
  }

  return safeProtocolUrl(url);
}

export type RichTextChildrenProps = { nodes: RichTextNode[] | undefined };

export type RichTextNodeProps = { node: RichTextNode };

export const NODE_RENDERERS: Record<string, (node: RichTextNode) => ReactNode> = {
  text: (node) => withMarks(node),
  a: (node) => <RichTextLink node={node} />,
  img: (node) => <RichTextImage node={node} />,
  hr: () => <RichTextElement component="hr" />,
  break: () => <RichTextElement component="br" />,
  code_block: (node) => (
    <RichTextElement component="pre">
      <RichTextElement component="code" className={node.lang ? `language-${node.lang}` : undefined}>
        {node.value ?? ''}
      </RichTextElement>
    </RichTextElement>
  ),
  html: (node) => node.value ?? '',
  html_inline: (node) => node.value ?? '',
  invalid_markdown: (node) => node.value ?? '',
  maybe_mdx: (node) => node.value ?? '',
};

export type ContentRichTextProps = { content: RichTextContent };
