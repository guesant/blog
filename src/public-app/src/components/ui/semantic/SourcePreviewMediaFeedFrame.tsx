import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const SourcePreviewMediaFeedFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  placeItems: 'center',
  height: '100%',
  minHeight: { xs: 'var(--site-source-preview-mobile-min-h)', sm: 'var(--site-tile-min-h)' },
  overflow: 'hidden',
  backgroundColor: 'var(--site-accent-bg)',
});
