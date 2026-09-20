import { RichTextElement } from '../../ui';
import type { ReactNode } from 'react';

type RichTextMarkProps = {
  component: 'code' | 'strong' | 'em' | 'u';
  children: ReactNode;
};

export function RichTextMark(props: RichTextMarkProps) {
  return <RichTextElement component={props.component}>{props.children}</RichTextElement>;
}
