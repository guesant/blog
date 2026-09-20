import { MotionDiv } from '../ui';
import type { ReactNode } from 'react';

type ScrollRevealAnimatedProps = {
  children: ReactNode;
  delay: number;
  reduceMotion: boolean | null;
};

export function ScrollRevealAnimated(props: ScrollRevealAnimatedProps) {
  return (
    <MotionDiv
      initial={props.reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.45,
        delay: props.reduceMotion ? 0 : props.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {props.children}
    </MotionDiv>
  );
}
