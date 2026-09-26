import type { ReactNode } from 'react';
import { Box } from '../ui';

type PageTransitionProps = { children: ReactNode };

export function PageTransition(props: PageTransitionProps) {
  return <Box visualVariant="pageTransition">{props.children}</Box>;
}
