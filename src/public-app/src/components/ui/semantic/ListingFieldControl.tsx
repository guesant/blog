import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { FormControl as BaseComponent } from '@/components/ui/form-control';

export const ListingFieldControl = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    width: { xs: '100%', md: 'auto' },
    minWidth: { xs: 0, md: 'var(--site-field-min-sm)' },
    flex: { xs: '1 1 100%', md: '1 1 var(--site-field-min-sm)' },
  },
);
