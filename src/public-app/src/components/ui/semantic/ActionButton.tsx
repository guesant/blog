import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Button as BaseComponent } from '@/components/ui/button';

export const ActionButton = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    ...{
      ...{
        justifyContent: 'flex-start',
        textAlign: 'left',
        '& .MuiButton-endIcon': { marginLeft: 'auto' },
      },
      color: 'var(--site-primary)',
      borderColor: 'var(--site-primary)',
      '&:hover': {
        color: 'var(--site-primary-hover)',
        borderColor: 'var(--site-primary-hover)',
        backgroundColor: 'var(--site-surface-hover)',
      },
    },
  },
);
