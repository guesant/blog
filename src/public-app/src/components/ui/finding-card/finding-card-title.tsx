import type { ReactNode } from 'react';
import { Typography } from '../typography';
import type { FindingCardPresentation } from './finding-card-types';

type FindingCardTitleProps = {
  children: ReactNode;
  component: 'h2' | 'h3';
  presentation: FindingCardPresentation;
};

const titleStyles = {
  feed: {
    margin: 0,
    color: 'var(--site-text-primary)',
    fontSize: 'var(--site-text-xl)',
    fontWeight: 'var(--site-weight-bold)',
    letterSpacing: 'var(--site-letter-heading)',
    lineHeight: 'var(--site-leading-tight)',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'color .2s',
  },
  reference: { fontSize: 'var(--site-text-xl)', transition: 'color .2s' },
};

export function FindingCardTitle(props: FindingCardTitleProps) {
  return (
    <Typography component={props.component} sx={titleStyles[props.presentation]}>
      {props.children}
    </Typography>
  );
}
