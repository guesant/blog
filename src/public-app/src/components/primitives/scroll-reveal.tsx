'use client';

import { useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { useHydrated } from './use-hydrated';
import { ScrollRevealAnimated } from './scroll-reveal-animated';
import { ScrollRevealFallback } from './scroll-reveal-fallback';

type ScrollRevealProps = { children: ReactNode; delay?: number };

export function ScrollReveal(props: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  const mounted = useHydrated();

  if (!mounted) {
    return <ScrollRevealFallback {...props} />;
  }

  return <ScrollRevealAnimated {...props} delay={props.delay ?? 0} reduceMotion={reduceMotion} />;
}
