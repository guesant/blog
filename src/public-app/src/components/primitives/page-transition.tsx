import type { ReactNode } from 'react';
import { PageTransitionFallback } from './page-transition-fallback';

type PageTransitionProps = { children: ReactNode };

export function PageTransition(props: PageTransitionProps) {
  return <PageTransitionFallback {...props} />;
}
