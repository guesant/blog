import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const SourcePreviewEditorialItemFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  gap: 'var(--site-space-2)',
  minWidth: 0,
  overflow: 'visible',
  textAlign: 'left',
});
