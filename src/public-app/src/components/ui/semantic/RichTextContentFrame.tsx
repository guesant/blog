import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const RichTextContentFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    '& img': { display: 'block', height: 'auto', maxWidth: '100%' },
    '& p, & li': { textAlign: 'justify', hyphens: 'auto' },
    '& pre': { maxWidth: '100%', overflowX: 'auto' },
  },
);
