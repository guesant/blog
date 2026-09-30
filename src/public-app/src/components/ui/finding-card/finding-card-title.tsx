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
    width: '100%',
    color: 'var(--site-text-primary)',
    fontSize: 'var(--site-text-xl)',
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
  },
  reference: {
    width: '100%',
    fontSize: 'var(--site-text-xl)',
    textAlign: 'left',
    transition: 'color .2s',
    '& a': { color: 'var(--site-primary)' },
  },
};

export function FindingCardTitle(props: FindingCardTitleProps) {
  return (
    <Typography component={props.component} sx={titleStyles[props.presentation]}>
      {props.children}
    </Typography>
  );
}
