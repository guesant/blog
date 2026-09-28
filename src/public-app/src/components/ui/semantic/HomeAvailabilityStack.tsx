import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Stack as BaseComponent } from '@/components/ui/stack';

export const HomeAvailabilityStack = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  position: 'relative',
  zIndex: 1,
  mt: 'var(--site-space-3)',
  alignItems: 'center',
  justifyContent: 'center',
  pb: 'var(--site-space-8)',
  borderBottom: 1,
  borderColor: 'divider',
});
