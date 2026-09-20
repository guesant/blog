import { Box } from '../ui';
import type { ReactNode } from 'react';

type ScrollRevealFallbackProps = { children: ReactNode };

export function ScrollRevealFallback(props: ScrollRevealFallbackProps) {
  return <Box>{props.children}</Box>;
}
