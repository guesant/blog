import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Button as BaseComponent } from '@/components/ui/button';

export const AvailabilityButton = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    ...{
      justifyContent: 'flex-start',
      textAlign: 'left',
      '& .MuiButton-endIcon': { marginLeft: 'auto' },
    },
    color: 'var(--site-success)',
    borderColor: 'var(--site-success)',
    padding: 'var(--site-action-py) var(--site-action-px)',
    whiteSpace: 'nowrap',
    fontSize: { xs: 'var(--site-text-xs)', sm: 'var(--site-text-sm)' },
    textTransform: 'none',
    '&:hover': {
      color: 'var(--site-success)',
      borderColor: 'var(--site-success)',
      backgroundColor: 'var(--site-success-bg)',
    },
  },
);
