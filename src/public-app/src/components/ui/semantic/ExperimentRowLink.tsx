import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { NavLink as BaseComponent } from '@/components/primitives/nav-link';

export const ExperimentRowLink = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 'var(--site-space-3)',
    p: 'var(--site-inset-card)',
    border: 'var(--site-border-width) solid var(--site-border)',
    borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
    backgroundColor: 'var(--site-surface)',
    '&:hover .experiment-title': { color: 'secondary.main' },
  },
);
