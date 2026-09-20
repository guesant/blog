import { Typography } from '../../../ui';
import type { HomeHeroTextProps } from './home-hero-text.types';

type HomeHeroTextTitleProps = HomeHeroTextProps;

export function HomeHeroTextTitle(props: HomeHeroTextTitleProps) {
  return (
    <Typography variant="h1" sx={{ mt: 2, width: '100%', fontSize: 'var(--site-text-3xl)' }}>
      {props.children}
    </Typography>
  );
}
