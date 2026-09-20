import type { SxProps, Theme } from '@mui/material/styles';

type StyleVariant = Exclude<SxProps<Theme>, Function | readonly unknown[]>;

export const technologyMarqueeVariants: Record<string, StyleVariant> = {
  surface: {
    overflow: 'hidden',
    maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
    WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
  },
  track: {
    display: 'flex',
    width: 'max-content',
    gap: 1.5,
    animationName: 'technology-marquee-scroll',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: 'normal',
    '@keyframes technology-marquee-scroll': {
      from: { transform: 'translate3d(0, 0, 0)' },
      to: { transform: 'translate3d(-50%, 0, 0)' },
    },
  },
  trackReverse: {
    display: 'flex',
    width: 'max-content',
    gap: 1.5,
    animationName: 'technology-marquee-scroll',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDirection: 'reverse',
    '@keyframes technology-marquee-scroll': {
      from: { transform: 'translate3d(0, 0, 0)' },
      to: { transform: 'translate3d(-50%, 0, 0)' },
    },
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    m: 0,
    p: 0,
    listStyle: 'none',
    flex: '0 0 auto',
  },
};
