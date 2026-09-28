import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Button as BaseComponent } from '@/components/ui/button';

export const TopicExploreButton = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { whiteSpace: 'nowrap', textTransform: 'none' },
);
