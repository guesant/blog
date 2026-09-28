import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Stack as BaseComponent } from '@/components/ui/stack';

export const ProgressiveFooterStack = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  alignItems: 'center',
  mt: 'var(--site-space-4)',
  minHeight: 'var(--site-space-1)',
});
