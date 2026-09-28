import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const EmptyStateText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    maxWidth: '48ch',
    fontFamily: 'var(--site-font-mono)',
    fontSize: 'var(--site-text-sm)',
    whiteSpace: 'normal',
  },
);
