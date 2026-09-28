import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const FactEntryFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'grid',
    alignContent: 'start',
    gap: 'var(--site-space-1)',
    minWidth: 0,
    padding: 'var(--site-space-3)',
    border: 'var(--site-border-width) solid var(--site-border)',
    borderRadius: 0,
    backgroundColor: 'var(--site-surface)',
  },
);
