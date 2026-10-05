import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const FindingDetailPageFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  gap: 'var(--site-page-content-offset)',
  width: '100%',
  minWidth: 0,
});
