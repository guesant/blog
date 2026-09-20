import MuiBox from '@mui/material/Box';
import type { ReactNode } from 'react';
import { technologyMarqueeVariants } from './variants';

type TechnologyMarqueeTrackProps = {
  children: ReactNode;
  cloneClass: string;
  duration: string;
  reverse: boolean;
  trackClass: string;
};

export function TechnologyMarqueeTrack(props: TechnologyMarqueeTrackProps) {
  return (
    <MuiBox
      className={props.trackClass}
      sx={{
        ...technologyMarqueeVariants[props.reverse ? 'trackReverse' : 'track'],
        animationDuration: props.duration,
      }}
    >
      <MuiBox component="ul" sx={technologyMarqueeVariants.list}>
        {props.children}
      </MuiBox>
      <MuiBox
        component="ul"
        aria-hidden
        className={props.cloneClass}
        sx={technologyMarqueeVariants.list}
      >
        {props.children}
      </MuiBox>
    </MuiBox>
  );
}
