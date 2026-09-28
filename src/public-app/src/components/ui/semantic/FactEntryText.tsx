import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const FactEntryText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--site-space-1)',
    margin: 0,
    color: 'var(--site-text-secondary)',
    fontSize: 'var(--site-text-xs)',
    fontWeight: 'var(--site-weight-medium)',
    letterSpacing: 'var(--site-letter-label)',
    textTransform: 'uppercase',
  },
);
