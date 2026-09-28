import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const SourcePreviewDetailsFeedFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  alignContent: 'center',
  gap: 'var(--site-space-1)',
  padding: 'var(--site-space-3)',
  minWidth: 0,
  overflow: 'hidden',
  textAlign: 'left',
});
