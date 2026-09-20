import { Box } from '../ui';
import type { ReactNode } from 'react';

type PageTransitionFallbackProps = { children: ReactNode };

export function PageTransitionFallback(props: PageTransitionFallbackProps) {
  return <Box visualVariant="pageTransition">{props.children}</Box>;
}
