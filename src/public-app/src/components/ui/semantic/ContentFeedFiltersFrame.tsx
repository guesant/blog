import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const ContentFeedFiltersFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'flex',
  alignItems: 'stretch',
  gap: 'var(--site-space-2)',
  width: '100%',
  minWidth: 0,
  flex: '1 1 100%',
});
