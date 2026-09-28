import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const EmptyState2Frame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    m: 0,
    mb: 'var(--site-space-3)',
    color: 'text.secondary',
    fontFamily: 'var(--site-font-mono)',
    fontSize: 'var(--site-text-sm)',
    lineHeight: 'var(--site-leading-tight)',
  },
);
