import type { ReactNode } from 'react';
import { Typography } from '../typography';

type FindingCardTitleProps = {
  children: ReactNode;
  component: 'h2' | 'h3';
};

export function FindingCardTitle(props: FindingCardTitleProps) {
  return (
    <Typography
      component={props.component}
      sx={{
        margin: 0,
        width: '100%',
        color: 'var(--site-text-primary)',
        fontSize: 'var(--site-text-lg)',
        fontWeight: 'var(--site-weight-bold)',
        letterSpacing: 'var(--site-letter-heading)',
        lineHeight: 'var(--site-leading-tight)',
        textAlign: 'left',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'color .2s',
        '& a': { color: 'var(--site-primary)' },
      }}
    >
      {props.children}
    </Typography>
  );
}
