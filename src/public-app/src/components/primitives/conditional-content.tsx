import type { ReactNode } from 'react';

type ConditionalContentProps = {
  condition: boolean;
  content?: ReactNode;
  fallback?: ReactNode;
  children?: ReactNode;
};

export function ConditionalContent(props: ConditionalContentProps) {
  return props.condition
    ? (props.content ?? props.children ?? null)
    : (props.fallback ?? null);
}
