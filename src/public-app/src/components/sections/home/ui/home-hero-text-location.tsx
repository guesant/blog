import { Typography } from '../../../ui';
import type { HomeHeroTextProps } from './home-hero-text.types';

type HomeHeroTextLocationProps = HomeHeroTextProps;

export function HomeHeroTextLocation(props: HomeHeroTextLocationProps) {
  return (
    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
      {props.children}
    </Typography>
  );
}
