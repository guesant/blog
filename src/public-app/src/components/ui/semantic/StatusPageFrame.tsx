import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const StatusPageFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    width: '100%',
    maxWidth: 'var(--site-page-max)',
    mx: 'auto',
    boxSizing: 'border-box',
    minHeight: { xs: '55vh', md: '60vh' },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
);
