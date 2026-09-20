import MuiBox from '@mui/material/Box';
import type { ReactNode } from 'react';
import { technologyMarqueeVariants } from './variants';
import { TechnologyMarqueeTrack } from './track';

type TechnologyMarqueeSurfaceProps = {
  children: ReactNode;
  cloneClass: string;
  duration: string;
  reverse: boolean;
  trackClass: string;
};

export function TechnologyMarqueeSurface(props: TechnologyMarqueeSurfaceProps) {
  return (
    <MuiBox
      sx={{
        ...technologyMarqueeVariants.surface,
        [`&:hover .${props.trackClass}`]: { animationPlayState: 'paused' },
        '@media (prefers-reduced-motion: reduce)': {
          maskImage: 'none',
          WebkitMaskImage: 'none',
          [`& .${props.trackClass}`]: { animation: 'none', width: '100%', flexWrap: 'wrap' },
          [`& .${props.cloneClass}`]: { display: 'none' },
        },
      }}
    >
      <TechnologyMarqueeTrack
        cloneClass={props.cloneClass}
        duration={props.duration}
        reverse={props.reverse}
        trackClass={props.trackClass}
      >
        {props.children}
      </TechnologyMarqueeTrack>
    </MuiBox>
  );
}
