import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const FactEntry2Text = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    margin: 0,
    color: 'var(--site-text-primary)',
    fontSize: 'var(--site-text-body)',
    fontWeight: 'var(--site-weight-medium)',
    lineHeight: 'var(--site-leading-normal)',
    overflowWrap: 'anywhere',
  },
);
