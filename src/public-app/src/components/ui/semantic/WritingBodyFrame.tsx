import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const WritingBodyFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    '& > *': { display: 'grid', rowGap: 'var(--site-space-5)' },
    '& p, & li': {
      margin: 0,
      fontSize: 'var(--site-text-lg)',
      lineHeight: 'var(--site-leading-relaxed)',
    },
    '& h2': {
      margin: 0,
      fontSize: 'var(--site-text-2xl)',
    },
    '& h3': {
      margin: 0,
      fontSize: 'var(--site-text-xl)',
    },
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
