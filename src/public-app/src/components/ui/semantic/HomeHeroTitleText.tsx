import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const HomeHeroTitleText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { margin: 0, width: '100%', fontSize: 'var(--site-text-3xl)' },
);
