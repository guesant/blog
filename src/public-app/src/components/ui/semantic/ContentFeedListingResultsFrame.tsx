import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const ContentFeedListingResultsFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  rowGap: 'var(--site-space-6)',
  width: '100%',
  minWidth: 0,
});
