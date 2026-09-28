import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const ConnectionsSectionFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  gap: 'var(--site-space-4)',
  padding: 'var(--site-space-6)',
  borderRadius: 0,
  backgroundColor: 'var(--site-surface)',
});
