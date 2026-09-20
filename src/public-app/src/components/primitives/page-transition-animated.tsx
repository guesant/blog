import { AnimatePresence } from 'motion/react';
import { MotionDiv } from '../ui';
import { ConditionalContent } from './conditional-content';
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
      <ConditionalContent condition={!props.waitingForExit}>
        <MotionDiv
          key={props.pathname}
          initial={props.reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={props.reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          visualVariant="pageTransition"
        >
          {props.children}
        </MotionDiv>
      </ConditionalContent>
    </AnimatePresence>
  );
}
