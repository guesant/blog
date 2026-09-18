'use client';

import Box, { type BoxProps } from '@mui/material/Box';
import { type RefObject, useEffect, useRef } from 'react';

type TechnicalGridProps = { variant?: 'hero' | 'panel' };

function isMousePointer(event: PointerEvent) {
  return !event.pointerType || event.pointerType === 'mouse';
}

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

function useGridPointer(gridRef: RefObject<HTMLDivElement | null>, disabled: boolean) {
  useEffect(() => {
    const grid = gridRef.current;
    const supportsInteraction = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );

    if (!grid || disabled || !supportsInteraction.matches) {
      return;
    }

    const controller = new GridPointerController(grid);
    controller.start();
    return () => controller.stop();
  }, [disabled, gridRef]);
}

function technicalGridSx(isPanel: boolean): BoxProps['sx'] {
  const panelMask = 'radial-gradient(ellipse at center, #000 12%, transparent 72%)';
  const heroMask = 'radial-gradient(ellipse at 70% 45%, #000 4%, transparent 68%)';
  const maskImage = isPanel ? panelMask : heroMask;

  return {
    position: 'absolute',
    pointerEvents: 'none',
    inset: isPanel ? 0 : { xs: '-1rem -1.5rem 0 30%', md: '-2rem 0 -1rem 48%' },
    opacity: isPanel ? 0.34 : 0.42,
    backgroundImage: 'radial-gradient(circle, rgba(29,95,167,.36) 1px, transparent 1.2px)',
    backgroundPosition: 'center',
    backgroundSize: isPanel ? '1rem 1rem' : '1.125rem 1.125rem',
    maskImage,
    WebkitMaskImage: maskImage,
    '&::before, &::after': {
      position: 'absolute',
      inset: 0,
      content: '""',
      opacity: 0,
      transition: 'opacity 180ms ease-out',
    },
    '&::before': {
      background:
        'radial-gradient(circle 10rem at var(--grid-pointer-x, 70%) var(--grid-pointer-y, 42%), rgba(29,95,167,.075), transparent 72%)',
    },
    '&::after': {
      backgroundImage: 'radial-gradient(circle, rgba(29,95,167,.7) 1px, transparent 1.25px)',
      backgroundSize: '1.125rem 1.125rem',
      backgroundPosition: 'center',
      maskImage:
        'radial-gradient(circle 10rem at var(--grid-pointer-x, 70%) var(--grid-pointer-y, 42%), #000, rgba(0,0,0,.65) 38%, transparent 100%)',
      WebkitMaskImage:
        'radial-gradient(circle 10rem at var(--grid-pointer-x, 70%) var(--grid-pointer-y, 42%), #000, rgba(0,0,0,.65) 38%, transparent 100%)',
    },
    ...(!isPanel && {
      '@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)': {
        '&::before': { opacity: 1 },
        '&::after': { opacity: 0.72 },
      },
    }),
  };
}

export function TechnicalGrid(props: TechnicalGridProps) {
  const { variant = 'hero' } = props;
  const isPanel = variant === 'panel';
  const gridRef = useRef<HTMLDivElement>(null);
  useGridPointer(gridRef, isPanel);

  return <Box ref={gridRef} aria-hidden sx={technicalGridSx(isPanel)} />;
}
