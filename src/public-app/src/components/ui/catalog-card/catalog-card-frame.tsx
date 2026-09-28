import type { ElementType, ReactNode } from 'react';
import { Card } from '../card';

type CatalogCardFrameProps = {
  children: ReactNode;
  component?: ElementType;
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'outlined';
};

const frameStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-space-2)',
  padding: 'var(--site-inset-card)',
  borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
  color: 'inherit',
  textDecoration: 'none',
};

export function CatalogCardFrame(props: CatalogCardFrameProps) {
  return <Card {...props} sx={frameStyles} />;
}
