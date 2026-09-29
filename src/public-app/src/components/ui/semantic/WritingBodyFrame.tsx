import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';
import {
  editorialBodyStyles,
  editorialSectionTitleStyles,
  editorialSubsectionTitleStyles,
} from '../editorial-typography';

export const WritingBodyFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    '& > *': { display: 'grid', rowGap: 'var(--site-space-5)' },
    '& p, & li': {
      ...editorialBodyStyles,
      margin: 0,
    },
    '& h2': { ...editorialSectionTitleStyles },
    '& h3': { ...editorialSubsectionTitleStyles },
    '& ul, & ol': { margin: 0, paddingInlineStart: 'var(--site-space-6)' },
    '& pre': {
      margin: 0,
      overflowX: 'auto',
      padding: 'var(--site-space-4)',
      bgcolor: 'background.paper',
    },
    '& code': { fontFamily: 'var(--font-mono)' },
    '& a': { color: 'primary.main' },
  },
);
