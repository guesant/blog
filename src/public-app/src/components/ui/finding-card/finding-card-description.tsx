import type { ReactNode } from 'react';
import { Typography } from '../typography';
import type { FindingCardPresentation } from './finding-card-types';

type FindingCardDescriptionProps = {
  children: ReactNode;
  presentation: FindingCardPresentation;
};

const descriptionStyles = {
  feed: {
    marginBlockStart: 'var(--site-space-2)',
    color: 'var(--site-text-primary)',
    fontSize: 'var(--site-text-body)',
    lineHeight: 'var(--site-leading-relaxed)',
    textAlign: 'left',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  reference: { fontSize: 'var(--site-text-body)', maxWidth: '48ch', textAlign: 'left' },
};

export function FindingCardDescription(props: FindingCardDescriptionProps) {
  return (
    <Typography color="text.secondary" sx={descriptionStyles[props.presentation]}>
      {props.children}
    </Typography>
  );
}
