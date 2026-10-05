import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const FollowSectionFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'grid',
    rowGap: 'var(--site-page-section-gap)',
    width: '100%',
  },
);
