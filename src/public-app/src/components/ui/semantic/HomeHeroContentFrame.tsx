import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const HomeHeroContentFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    rowGap: 'var(--site-space-6)',
    width: '100%',
    textAlign: 'left',
  },
);
