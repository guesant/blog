import type { ReactNode } from 'react';
import type { RichTextNode } from './types';
import { RichTextMark } from './rich-text-mark';

export function withMarks(node: RichTextNode): ReactNode {
  const markEntries = [
    ['code', 'code'],
    ['bold', 'strong'],
    ['italic', 'em'],
    ['underline', 'u'],
  ] as const;

  const marks = markEntries.filter(([key]) => Boolean(node[key])).map(([, component]) => component);

  return marks.reduce<ReactNode>(
    (children, component) => <RichTextMark component={component} children={children} />,
    node.text ?? '',
  );
}
