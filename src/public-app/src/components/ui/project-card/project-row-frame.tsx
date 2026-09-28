import type { ReactNode } from 'react';
import { Card } from '../card';

type ProjectRowFrameProps = { children: ReactNode };

const frameStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-space-2)',
  padding: 'var(--site-inset-card)',
  borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
  borderTop: 'var(--site-border-width) solid var(--site-border)',
  borderRight: 'var(--site-border-width) solid var(--site-border)',
  borderBottom: 'var(--site-border-width) solid var(--site-border)',
  backgroundColor: 'var(--site-surface)',
  '&:hover .project-row-title': { color: 'var(--site-primary)' },
};

export function ProjectRowFrame(props: ProjectRowFrameProps) {
  return (
    <Card component="article" sx={frameStyles}>
      {props.children}
    </Card>
  );
}
