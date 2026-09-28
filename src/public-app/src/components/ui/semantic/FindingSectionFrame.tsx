import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const FindingSectionFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'grid',
    gap: 'var(--site-space-4)',
    paddingBlock: 0,
    paddingInline: 0,
    borderRadius: 0,
    backgroundColor: 'var(--site-surface)',
  },
);
