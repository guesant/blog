import { Typography } from '../../../ui';
import type { HomeHeroTextProps } from './home-hero-text.types';

type HomeHeroTextBodyProps = HomeHeroTextProps;

export function HomeHeroTextBody(props: HomeHeroTextBodyProps) {
  return (
    <Typography
      component="p"
      sx={{
        width: '100%',
        fontFamily: 'var(--site-font-action)',
        textAlign: 'justify',
        hyphens: 'auto',
        fontSize: 'var(--site-text-lg)',
        fontWeight: 'var(--site-weight-medium)',
        lineHeight: 'var(--site-leading-relaxed)',
        color: 'text.secondary',
        mt: props.kind === 'experience' ? 3.5 : 2.5,
      }}
    >
      {props.children}
    </Typography>
  );
}
