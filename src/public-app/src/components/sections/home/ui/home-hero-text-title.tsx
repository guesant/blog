import { Typography } from '../../../ui';
import type { HomeHeroTextProps } from './home-hero-text.types';

type HomeHeroTextTitleProps = HomeHeroTextProps;

export function HomeHeroTextTitle(props: HomeHeroTextTitleProps) {
  return (
    <Typography variant="h1" visualVariant="homeHeroTitle">
      {props.children}
    </Typography>
  );
}
