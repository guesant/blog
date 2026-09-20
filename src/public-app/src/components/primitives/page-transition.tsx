'use client';

import { useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { usePathname } from '../../i18n/navigation';
import { useHydrated } from './use-hydrated';
import { usePageTransitionState } from './use-page-transition-state';
import { PageTransitionAnimated } from './page-transition-animated';
import { PageTransitionFallback } from './page-transition-fallback';

type PageTransitionProps = { children: ReactNode };

export function PageTransition(props: PageTransitionProps) {
  const reduceMotion = useReducedMotion();

  const mounted = useHydrated();

  const pathname = usePathname();

  const transition = usePageTransitionState({ children: props.children, pathname });

  if (!mounted) {
    return <PageTransitionFallback {...props} />;
  }

  return (
    <PageTransitionAnimated
      children={transition.children}
      pathname={transition.pathname}
      waitingForExit={transition.waitingForExit}
      handleExitComplete={transition.handleExitComplete}
      reduceMotion={reduceMotion}
    />
  );
}
