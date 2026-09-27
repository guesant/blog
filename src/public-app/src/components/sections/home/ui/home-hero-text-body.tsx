import { Typography } from '../../../ui';
import type { HomeHeroTextProps } from './home-hero-text.types';

type HomeHeroTextBodyProps = HomeHeroTextProps;

export function HomeHeroTextBody(props: HomeHeroTextBodyProps) {
  return (
    <Typography component="p" visualVariant="homeIntro">
      {props.children}
    </Typography>
  );
}
