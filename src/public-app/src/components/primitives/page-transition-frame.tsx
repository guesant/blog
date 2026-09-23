import { MotionDiv } from '../ui';
import type { ReactNode } from 'react';

type PageTransitionFrameProps = {
  children: ReactNode;
  reduceMotion: boolean | null;
};

export function PageTransitionFrame(props: PageTransitionFrameProps) {
  return (
    <MotionDiv
      initial={props.reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={props.reduceMotion ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      visualVariant="pageTransition"
    >
      {props.children}
    </MotionDiv>
  );
}
