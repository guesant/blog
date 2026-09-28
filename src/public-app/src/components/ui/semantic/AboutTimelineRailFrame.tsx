import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const AboutTimelineRailFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  position: 'relative',
  display: 'grid',
  rowGap: 'var(--site-space-2)',
  paddingLeft: 'var(--site-space-5)',
  paddingBottom: 'var(--site-space-5)',
  borderLeft: 'var(--site-border-width) solid var(--site-border)',
});
