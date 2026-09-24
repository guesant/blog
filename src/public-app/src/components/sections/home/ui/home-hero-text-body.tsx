import { Typography } from '../../../ui';
import type { HomeHeroTextProps } from './home-hero-text.types';

type HomeHeroTextBodyProps = HomeHeroTextProps;

export function HomeHeroTextBody(props: HomeHeroTextBodyProps) {
  return (
    <Typography
      component="p"
      visualVariant="homeIntro"
      sx={{
        mt: props.kind === 'experience' ? 3.5 : 2.5,
      }}
    >
      {props.children}
    </Typography>
  );
}
