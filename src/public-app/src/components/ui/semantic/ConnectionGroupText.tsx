import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const ConnectionGroupText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    marginBottom: 'var(--site-space-2)',
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-sm)',
    fontWeight: 'var(--site-weight-semibold)',
    textTransform: 'capitalize',
  },
);
