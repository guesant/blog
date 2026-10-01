import type { ReactNode } from 'react';
import { Typography } from '../typography';

type FindingCardDescriptionProps = {
  children: ReactNode;
};

export function FindingCardDescription(props: FindingCardDescriptionProps) {
  return (
    <Typography
      color="text.secondary"
      sx={{
        color: 'var(--site-text-primary)',
        fontSize: 'var(--site-text-body)',
        lineHeight: 'var(--site-leading-relaxed)',
        textAlign: 'left',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {props.children}
    </Typography>
  );
}
