import type { ElementType, ReactNode } from 'react';
import { Card } from '../card';

export type ListingCardFrameProps = {
  children: ReactNode;
  component?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'outlined';
};

const frameStyles = {
  position: 'relative',
  padding:
    'var(--site-space-4) var(--site-space-5) var(--site-space-5) calc(var(--site-space-5) + var(--site-feed-accent-w))',
  display: 'flex',
  flexDirection: 'column',
  borderColor: 'divider',
  border: 'var(--site-border-width) solid var(--site-border)',
  borderRadius: 0,
  gap: 'var(--site-space-2)',
  overflow: 'hidden',
  backgroundColor: 'var(--site-surface)',
  boxShadow: 'none',
  textAlign: 'left',
  color: 'inherit',
  textDecoration: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '0 auto 0 0',
    width: 'var(--site-feed-accent-w)',
    backgroundColor: 'var(--site-primary)',
  },
  '&:hover .content-feed-title': { color: 'secondary.main' },
};

export function ListingCardFrame(props: ListingCardFrameProps) {
  return <Card {...props} component={props.component} sx={frameStyles} />;
}
