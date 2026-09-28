import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Button as BaseComponent } from '@/components/ui/button';

export const SidebarButton = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    ...{
      justifyContent: 'flex-start',
      textAlign: 'left',
      '& .MuiButton-endIcon': { marginLeft: 'auto' },
    },
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textTransform: 'none',
    color: 'var(--site-primary-muted)',
    borderColor: 'var(--site-primary-muted)',
    '&:hover': {
      color: 'var(--site-primary)',
      borderColor: 'var(--site-primary)',
      backgroundColor: 'var(--site-surface-hover)',
    },
  },
);
