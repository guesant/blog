import MuiBox from '@mui/material/Box';
import { forwardRef } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { gridLayers } from './technical-grid-styles';

const heroMask = 'radial-gradient(ellipse at 70% 45%, #000 4%, transparent 68%)';

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

export const HeroTechnicalGridSurface = forwardRef<HTMLDivElement>(
  function HeroTechnicalGridSurface(_props, ref) {
    return <MuiBox ref={ref} aria-hidden sx={heroStyles} />;
  },
);
