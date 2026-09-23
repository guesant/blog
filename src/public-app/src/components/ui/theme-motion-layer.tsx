'use client';

import type { ReactNode } from 'react';
import { NavigationProgress } from '../navigation/navigation-progress';
import { ContextualCursor } from '../primitives/contextual-cursor';

type ThemeMotionLayerProps = { children: ReactNode };

export function ThemeMotionLayer(props: ThemeMotionLayerProps) {
  return (
    <>
      <NavigationProgress />
      <ContextualCursor />
      {props.children}
    </>
  );
}
