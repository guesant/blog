import type { ReactNode } from 'react';
import { Chip } from '../chip';

type FindingCardKindChipProps = {
  children: ReactNode;
  clickable?: boolean;
  onClick?: () => void;
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
      clickable={props.clickable}
      label={props.children}
      onClick={props.onClick}
      size="small"
      sx={chipStyles}
    />
  );
}
