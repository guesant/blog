import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { ArrowForward as BaseComponent } from '@/components/ui/arrow-forward';

export const TopicArrowArrow = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { fontSize: 'var(--site-icon-sm)' },
);
