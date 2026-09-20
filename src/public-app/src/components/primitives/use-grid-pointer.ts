import type { RefObject } from 'react';
import { useEffect } from 'react';
import { isMousePointer } from './is-mouse-pointer';

class GridPointerController {
  private animationFrame = 0;
  private pointerX = 0;
  private pointerY = 0;

  constructor(private readonly grid: HTMLDivElement) {}

  private readonly renderPointer = () => {
    const rect = this.grid.getBoundingClientRect();

    this.grid.style.setProperty('--grid-pointer-x', `${this.pointerX - rect.left}px`);
    this.grid.style.setProperty('--grid-pointer-y', `${this.pointerY - rect.top}px`);
    this.animationFrame = 0;
  };

  private readonly updatePointer = (event: PointerEvent) => {
    if (!isMousePointer(event)) {
      return;
    }
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    if (!this.animationFrame) {
      this.animationFrame = window.requestAnimationFrame(this.renderPointer);
    }
  };

  start() {
    window.addEventListener('pointermove', this.updatePointer, { passive: true });
  }

  stop() {
    window.removeEventListener('pointermove', this.updatePointer);
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }
}

export function useGridPointer(gridRef: RefObject<HTMLDivElement | null>, disabled: boolean) {
  useEffect(() => {
    const grid = gridRef.current;

    const supportsInteraction = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );

    if (!grid || disabled || !supportsInteraction.matches) {
      return undefined;
    }

    const controller = new GridPointerController(grid);

    controller.start();
    return () => controller.stop();
  }, [disabled, gridRef]);
}
