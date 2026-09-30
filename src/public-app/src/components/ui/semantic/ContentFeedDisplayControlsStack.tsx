import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Stack as BaseComponent } from '@/components/ui/stack';

export const ContentFeedDisplayControlsStack = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  alignItems: 'center',
  flexWrap: 'wrap',
  rowGap: 'var(--site-gap-stack)',
  columnGap: 'var(--site-gap-cluster)',
});
