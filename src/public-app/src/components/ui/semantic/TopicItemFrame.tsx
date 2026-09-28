import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const TopicItemFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--site-space-3)',
    p: 'var(--site-inset-card)',
    border: 'var(--site-border-width) solid var(--site-border)',
    borderLeft: 'var(--site-feed-accent-w) solid var(--site-primary)',
    backgroundColor: 'var(--site-surface)',
  },
);
