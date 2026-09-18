'use client';

import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { type ReactNode, useSyncExternalStore } from 'react';
import { usePathname } from '../../i18n/navigation';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type PageTransitionProps = { children: ReactNode };

export function PageTransition(props: PageTransitionProps) {
  const { children } = props;
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const pathname = usePathname();

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
