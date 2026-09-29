import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { RichTextElement } from '../../ui';
import { safeUrl } from './types';

export type MarkdownLinkProps = {
  children?: ReactNode;
  href?: string;
  title?: string;
};

export function MarkdownLink(props: MarkdownLinkProps) {
  const href = safeUrl(props.href);

  return (
    <ConditionalContent
      condition={Boolean(href)}
      content={
        <RichTextElement component="a" href={href} title={props.title}>
          {props.children}
        </RichTextElement>
      }
      fallback={props.children}
    />
  );
}
