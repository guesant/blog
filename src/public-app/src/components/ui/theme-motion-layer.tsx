'use client';

import { domAnimation, LazyMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { NavigationProgress } from '../navigation/navigation-progress';
import { ContextualCursor } from '../primitives/contextual-cursor';

type ThemeMotionLayerProps = { children: ReactNode };

export function ThemeMotionLayer(props: ThemeMotionLayerProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <NavigationProgress />
      <ContextualCursor />
      {props.children}
    </LazyMotion>
  );
}
