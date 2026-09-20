import { CursorController } from './cursor-controller';

export function createCursorController(dot: HTMLDivElement | null, frame: HTMLDivElement | null) {
  if (!dot || !frame) return null;

  const supportsCursor = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );

  if (!supportsCursor.matches || window.self !== window.top) return null;
  return new CursorController(dot, frame);
}
