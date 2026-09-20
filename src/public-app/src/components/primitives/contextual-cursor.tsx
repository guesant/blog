'use client';

import { useRef } from 'react';
import { Box } from '../ui';

const CONTEXTUAL_CURSOR_ENABLED = false;

import { useCursorController } from './use-cursor-controller';

export function ContextualCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  const frameRef = useRef<HTMLDivElement>(null);

  useCursorController(dotRef, frameRef, CONTEXTUAL_CURSOR_ENABLED);

  if (!CONTEXTUAL_CURSOR_ENABLED) {
    return null;
  }

  return (
    <>
      <Box ref={frameRef} className="contextual-cursor contextual-cursor-frame" aria-hidden />
      <Box ref={dotRef} className="contextual-cursor contextual-cursor-dot" aria-hidden />
    </>
  );
}
