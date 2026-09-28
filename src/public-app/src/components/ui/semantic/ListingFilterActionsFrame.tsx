import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const ListingFilterActionsFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'flex',
  flexShrink: 0,
  alignItems: 'stretch',
  gap: 'var(--site-space-2)',
});
