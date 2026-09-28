import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const SnippetFileFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    m: 0,
    p: 2,
    overflow: 'auto',
    fontFamily: 'var(--site-font-mono)',
    fontSize: 'var(--site-text-sm)',
  },
);
