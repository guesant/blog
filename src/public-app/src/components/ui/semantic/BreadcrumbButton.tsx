import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Button as BaseComponent } from '@/components/ui/button';

export const BreadcrumbButton = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    ...{
      justifyContent: 'flex-start',
      textAlign: 'left',
      '& .MuiButton-endIcon': { marginLeft: 'auto' },
    },
    minHeight: 'var(--site-control-h-xs)',
    padding: 'var(--site-action-py) var(--site-action-px)',
    color: 'var(--site-text-secondary)',
    border: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      color: 'var(--site-primary)',
      border: 0,
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  },
);
