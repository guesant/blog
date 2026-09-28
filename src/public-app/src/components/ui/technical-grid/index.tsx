import MuiBox from '@mui/material/Box';
import { forwardRef } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

const panelMask = 'radial-gradient(ellipse at center, #000 12%, transparent 72%)';

const heroMask = 'radial-gradient(ellipse at 70% 45%, #000 4%, transparent 68%)';

const gridLayers: SxProps<Theme> = {
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
};

const panelStyles: SxProps<Theme> = {
  position: 'absolute',
  pointerEvents: 'none',
  inset: 0,
  opacity: 0.34,
  backgroundImage: 'radial-gradient(circle, rgba(29,95,167,.36) 1px, transparent 1.2px)',
  backgroundPosition: 'center',
  backgroundSize: '1rem 1rem',
  maskImage: panelMask,
  WebkitMaskImage: panelMask,
  ...gridLayers,
};

const heroStyles: SxProps<Theme> = {
  position: 'absolute',
  pointerEvents: 'none',
  inset: { xs: '-1rem -1.5rem 0 30%', md: '-2rem 0 -1rem 48%' },
  opacity: 0.42,
  backgroundImage: 'radial-gradient(circle, rgba(29,95,167,.36) 1px, transparent 1.2px)',
  backgroundPosition: 'center',
  backgroundSize: '1.125rem 1.125rem',
  maskImage: heroMask,
  WebkitMaskImage: heroMask,
  ...gridLayers,
  '@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)': {
    '&::before': { opacity: 1 },
    '&::after': { opacity: 0.72 },
  },
};

type TechnicalGridSurfaceProps = {
  panel: boolean;
};

export const TechnicalGridSurface = forwardRef<HTMLDivElement, TechnicalGridSurfaceProps>(
  function TechnicalGridSurface(props, ref) {
    return <MuiBox ref={ref} aria-hidden sx={props.panel ? panelStyles : heroStyles} />;
  },
);
