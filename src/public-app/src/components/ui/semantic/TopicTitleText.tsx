import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const TopicTitleText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { fontWeight: 'var(--site-weight-semibold)' },
);
