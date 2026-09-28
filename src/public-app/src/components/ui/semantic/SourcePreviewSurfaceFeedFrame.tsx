import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const SourcePreviewSurfaceFeedFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' },
  minWidth: 0,
  overflow: 'hidden',
  border: 'var(--site-border-width) solid var(--site-border)',
  borderColor: 'var(--site-border)',
  textAlign: 'left',
});
