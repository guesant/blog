import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const SourcePreviewListItemFallbackFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  placeItems: 'center',
  height: '100%',
  minHeight: 'var(--site-space-12)',
  color: 'var(--site-primary)',
});
