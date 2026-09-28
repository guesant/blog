import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const LinkListFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'grid',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    listStyle: 'none',
    border: 'var(--site-border-width) solid var(--site-border)',
    borderRadius: 0,
    backgroundColor: 'var(--site-surface)',
  },
);
