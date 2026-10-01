import MuiBox from '@mui/material/Box';
import { forwardRef } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { gridLayers } from './technical-grid-styles';

const panelMask = 'radial-gradient(ellipse at center, #000 12%, transparent 72%)';

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

export const PanelTechnicalGridSurface = forwardRef<HTMLDivElement>(
  function PanelTechnicalGridSurface(_props, ref) {
    return <MuiBox ref={ref} aria-hidden sx={panelStyles} />;
  },
);
