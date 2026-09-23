import { AnimatePresence } from 'motion/react';
import { PageTransitionFrame } from './page-transition-frame';
import type { ReactNode } from 'react';

type PageTransitionAnimatedProps = {
  children: ReactNode;
  pathname: string;
  waitingForExit: boolean;
  handleExitComplete: () => void;
  reduceMotion: boolean | null;
};

export function PageTransitionAnimated(props: PageTransitionAnimatedProps) {
  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={props.handleExitComplete}>
      {!props.waitingForExit && (
        <PageTransitionFrame
          key={props.pathname}
          reduceMotion={props.reduceMotion}
          children={props.children}
        />
      )}
    </AnimatePresence>
  );
}
