import type { ReactNode } from 'react';

type PreviousRouteProps = { content: ReactNode };

export function PreviousRoute(props: PreviousRouteProps) {
  return props.content;
}
