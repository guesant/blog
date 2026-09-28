import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const SiteShellFrame2 = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { color: 'var(--site-text-primary)' },
);
