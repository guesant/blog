import type { ReactNode } from 'react';
import { PageTransitionFrame } from '../ui/semantic/PageTransitionFrame';

type PageTransitionProps = { children: ReactNode };

export function PageTransition(props: PageTransitionProps) {
  return <PageTransitionFrame>{props.children}</PageTransitionFrame>;
}
