import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const EmptyStateFrame = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    py: { xs: 5, md: 6 },
    px: { xs: 3, md: 4 },
    borderTop: 1,
    borderBottom: 1,
    borderColor: 'divider',
    textAlign: 'center',
  },
);
