import MuiBox from '@mui/material/Box';
import { forwardRef } from 'react';
import { technicalGridVariants } from './variants';

type TechnicalGridSurfaceProps = {
  panel: boolean;
};

export const TechnicalGridSurface = forwardRef<HTMLDivElement, TechnicalGridSurfaceProps>(
  function TechnicalGridSurface(props, ref) {
    return (
      <MuiBox ref={ref} aria-hidden sx={technicalGridVariants[props.panel ? 'panel' : 'hero']} />
    );
  },
);
