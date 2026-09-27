'use client';

import { useRef } from 'react';
import { Box } from '../ui';
import { useCursorController } from './use-cursor-controller';

type ContextualCursorProps = { enabled: boolean };

export function ContextualCursor(props: ContextualCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);

  const frameRef = useRef<HTMLDivElement>(null);

  useCursorController(dotRef, frameRef, props.enabled);

  if (!props.enabled) {
    return null;
  }

  return (
    <>
      <Box ref={frameRef} className="contextual-cursor contextual-cursor-frame" aria-hidden />
      <Box ref={dotRef} className="contextual-cursor contextual-cursor-dot" aria-hidden />
    </>
  );
}
