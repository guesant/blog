'use client';

import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { type ReactNode, useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type ScrollRevealProps = { children: ReactNode; delay?: number };

export function ScrollReveal(props: ScrollRevealProps) {
  const { children, delay = 0 } = props;
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <m.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
