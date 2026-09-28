import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const AboutTimelinePointFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  position: 'absolute',
  top: 0,
  left: 'calc(var(--site-space-5) * -0.5 - var(--site-border-width) * 0.5)',
  width: 'var(--site-space-2)',
  height: 'var(--site-space-2)',
  boxSizing: 'border-box',
  border: 'var(--site-border-width-focus) solid var(--site-primary)',
  borderRadius: '50%',
  backgroundColor: 'var(--site-surface)',
});
