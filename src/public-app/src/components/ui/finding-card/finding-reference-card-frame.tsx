import type { ReactNode } from 'react';
import { Card } from '../card';

type FindingReferenceCardFrameProps = { children: ReactNode };

const frameStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-space-2)',
  padding: 'var(--site-inset-card)',
  backgroundColor: 'var(--site-surface)',
  borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
  borderColor: 'var(--site-border)',
  textAlign: 'left',
  transition:
    'border-color var(--site-duration-short-4), background-color var(--site-duration-short-4)',
  '&:hover .reference-card-title': { color: 'secondary.main' },
  '&:hover': {
    borderColor: 'var(--site-primary-hover)',
    backgroundColor: 'var(--site-surface-hover)',
  },
};

export function FindingReferenceCardFrame(props: FindingReferenceCardFrameProps) {
  return <Card sx={frameStyles}>{props.children}</Card>;
}
