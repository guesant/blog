import type { ReactNode } from 'react';
import { Typography } from '../typography';
import { findingCardTitleStyles } from './finding-card-title-styles';

type FindingCardTitleProps = {
  children?: ReactNode;
  component: 'h2' | 'h3';
  content?: ReactNode;
  fontSize?: string;
};

export function FindingCardTitle(props: FindingCardTitleProps) {
  return (
    <Typography
      component={props.component}
      sx={{
        ...findingCardTitleStyles,
        fontSize: props.fontSize ?? 'var(--site-text-lg)',
      }}
    >
      {props.content ?? props.children}
    </Typography>
  );
}
