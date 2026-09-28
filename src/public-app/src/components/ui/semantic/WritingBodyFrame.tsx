import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const WritingBodyFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    mt: 7,
    pt: 5,
    borderTop: 1,
    borderColor: 'divider',
    '& p, & li': { fontSize: '1.1rem', lineHeight: 1.8 },
    '& p': { mb: 3 },
    '& h2': { fontSize: '1.75rem', mt: 6, mb: 2 },
    '& h3': { fontSize: '1.35rem', mt: 5, mb: 2 },
    '& ul, & ol': { pl: 3, mb: 3 },
    '& pre': { overflowX: 'auto', p: 2.5, bgcolor: 'background.paper' },
    '& code': { fontFamily: 'var(--font-mono)' },
    '& a': { color: 'primary.main' },
  },
);
