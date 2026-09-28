import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const SnippetFileText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    px: 2,
    py: 1.5,
    borderBottom: 1,
    borderColor: 'divider',
    fontFamily: 'var(--site-font-mono)',
  },
);
