import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const ListingPaginationCenterFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--site-space-2)',
  minWidth: 0,
});
