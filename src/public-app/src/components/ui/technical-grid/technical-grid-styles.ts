import type { SxProps, Theme } from '@mui/material/styles';

export const gridLayers: SxProps<Theme> = {
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
