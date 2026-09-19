// @ts-nocheck
import type { JSX, ReactNode } from 'react';
import type { RichTextContent } from '../../domain/types.ts';

type RichTextNode = {
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

const ELEMENT_TAGS: Record<string, keyof JSX.IntrinsicElements> = {
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

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function safeUrl(url: string | undefined) {
  if (!url) {
    return undefined;
  }
  if (url.startsWith('/') || url.startsWith('#')) {
    return url;
  }
  try {
    return SAFE_PROTOCOLS.has(new URL(url).protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}

function withMarks(node: RichTextNode): ReactNode {
  let rendered: ReactNode = node.text ?? '';
  if (node.code) {
    rendered = <code>{rendered}</code>;
  }
  if (node.bold) {
    rendered = <strong>{rendered}</strong>;
  }
  if (node.italic) {
    rendered = <em>{rendered}</em>;
  }
  if (node.underline) {
    rendered = <u>{rendered}</u>;
  }
  return rendered;
}

type RichTextChildrenProps = { nodes: RichTextNode[] | undefined };

function RichTextChildren(props: RichTextChildrenProps) {
  const { nodes } = props;
  return (nodes ?? []).map((node, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: AST nodes carry no stable identity
    <RichTextNodeView key={index} node={node} />
  ));
}

type RichTextNodeProps = { node: RichTextNode };

function RichTextLink(props: RichTextNodeProps) {
  const { node } = props;
  const href = safeUrl(node.url);
  if (!href) {
    return <RichTextChildren nodes={node.children} />;
  }
  return (
    <a href={href} title={node.title}>
      <RichTextChildren nodes={node.children} />
    </a>
  );
}

function RichTextImage(props: RichTextNodeProps) {
  const { node } = props;
  const src = safeUrl(node.url);
  if (!src) {
    return null;
  }
  // biome-ignore lint/performance/noImgElement: CMS images are arbitrary remote URLs
  return <img src={src} alt={node.alt ?? node.caption ?? ''} />;
}

const NODE_RENDERERS: Record<string, (node: RichTextNode) => ReactNode> = {
  text: (node) => withMarks(node),
  a: (node) => <RichTextLink node={node} />,
  img: (node) => <RichTextImage node={node} />,
  hr: () => <hr />,
  break: () => <br />,
  code_block: (node) => (
    <pre>
      <code className={node.lang ? `language-${node.lang}` : undefined}>{node.value ?? ''}</code>
    </pre>
  ),
  html: (node) => node.value ?? '',
  html_inline: (node) => node.value ?? '',
  invalid_markdown: (node) => node.value ?? '',
  maybe_mdx: (node) => node.value ?? '',
};

function RichTextNodeView(props: RichTextNodeProps) {
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
    <Tag>
      <RichTextChildren nodes={node.children} />
    </Tag>
  );
}

export type ContentRichTextProps = { content: RichTextContent };

export function ContentRichText(contentRichTextProps: ContentRichTextProps) {
  const { content } = contentRichTextProps;
  const root = content as RichTextNode | undefined;
  return <RichTextChildren nodes={root?.children} />;
}
