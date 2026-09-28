import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const AboutTimelineItemFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(4.5rem, 6rem) minmax(0, 1fr)', sm: '8rem minmax(0, 1fr)' },
  columnGap: 'var(--site-space-4)',
});
