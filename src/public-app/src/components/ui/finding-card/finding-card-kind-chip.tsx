import type { ReactNode } from 'react';
import { Chip } from '../chip';

type FindingCardKindChipProps = {
  'aria-label'?: string;
  children?: ReactNode;
  clickable?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  title?: string;
};

const chipStyles = {
  height: 'auto',
  border: 0,
  borderRadius: 0,
  padding: 'var(--site-space-0-5) var(--site-space-2)',
  backgroundColor: 'var(--site-accent-bg)',
  color: 'var(--site-primary)',
  fontSize: 'var(--site-text-xs)',
  fontWeight: 'var(--site-weight-semibold)',
  letterSpacing: 'var(--site-letter-label)',
  lineHeight: 'var(--site-leading-normal)',
  '&:hover': { backgroundColor: 'var(--site-surface-hover)' },
};

export function FindingCardKindChip(props: FindingCardKindChipProps) {
  return (
    <Chip
      aria-label={props['aria-label']}
      clickable={props.clickable}
      label={props.icon ?? props.children}
      onClick={props.onClick}
      size="small"
      sx={chipStyles}
      title={props.title}
    />
  );
}
