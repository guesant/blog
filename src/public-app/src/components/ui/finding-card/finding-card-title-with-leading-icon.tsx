import type { ReactNode } from 'react';
import { Icon } from '../../primitives/icon';
import type { IconName } from '../../primitives/icon';
import { Typography } from '../typography';
import { findingCardTitleWithLeadingIconStyles } from './finding-card-title-styles';

type FindingCardTitleWithLeadingIconProps = {
  children?: ReactNode;
  component: 'h2' | 'h3';
  content?: ReactNode;
  fontSize?: string;
  leadingIcon: IconName;
};

export function FindingCardTitleWithLeadingIcon(props: FindingCardTitleWithLeadingIconProps) {
  return (
    <Typography
      component={props.component}
      sx={{
        ...findingCardTitleWithLeadingIconStyles,
        fontSize: props.fontSize ?? 'var(--site-text-lg)',
      }}
    >
      <Icon name={props.leadingIcon} size={18} />
      {props.content ?? props.children}
    </Typography>
  );
}
