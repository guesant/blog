import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const ReferenceLinkLabelFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  flex: '1 1 auto',
  minWidth: 0,
  gap: 'var(--site-space-0-5)',
});
