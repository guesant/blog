import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const AboutEditorialPageFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  width: '100%',
  maxWidth: 'var(--site-content-max)',
  mx: 'auto',
  display: 'grid',
  rowGap: 'var(--site-space-8)',
});
