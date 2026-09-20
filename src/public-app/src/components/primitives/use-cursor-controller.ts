import { type RefObject, useEffect } from 'react';
import { createCursorController } from './create-cursor-controller';

export function useCursorController(
  dotRef: RefObject<HTMLDivElement | null>,
  frameRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return undefined;

    const controller = createCursorController(dotRef.current, frameRef.current);

    if (!controller) return undefined;
    controller.start();
    return () => controller.stop();
  }, [dotRef, frameRef, enabled]);
}
