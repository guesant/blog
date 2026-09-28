import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Stack as BaseComponent } from '@/components/ui/stack';

export const ListingToolbarContentStack = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  columnGap: { xs: 'var(--site-space-2)', md: 'var(--site-space-3)' },
  rowGap: 'var(--site-space-5)',
  flexWrap: 'wrap',
});
