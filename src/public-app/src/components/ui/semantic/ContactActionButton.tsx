import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Button } from '../button';

export const ContactActionButton = createSemanticSxComponent<ComponentProps<typeof Button>>(
  Button,
  {
    justifyContent: 'flex-start',
    textAlign: 'left',
    '& .MuiButton-endIcon': { marginLeft: 'auto' },
    width: '100%',
    minWidth: 0,
    textTransform: 'none',
    color: 'var(--site-primary)',
    borderColor: 'var(--site-primary)',
    backgroundColor: 'transparent',
    '&:hover': {
      color: 'var(--site-primary-hover)',
      borderColor: 'var(--site-primary-hover)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
);
