import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';
import { editorialBodyStyles } from '../editorial-typography';

export const RichTextContentFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    '& img': { display: 'block', height: 'auto', maxWidth: '100%' },
    '& p, & li': editorialBodyStyles,
    '& pre': { maxWidth: '100%', overflowX: 'auto' },
  },
);
