import { createElement, type JSX, type ReactNode } from 'react';

type RichTextElementProps = Record<string, unknown> & {
  children?: ReactNode;
  component: keyof JSX.IntrinsicElements;
};

export function RichTextElement(props: RichTextElementProps) {
  const { component, ...elementProps } = props;

  return createElement(component, elementProps);
}
