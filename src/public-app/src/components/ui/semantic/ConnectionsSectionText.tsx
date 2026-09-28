import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const ConnectionsSectionText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  margin: 0,
  fontSize: 'var(--site-text-2xl)',
  fontWeight: 'var(--site-weight-bold)',
  letterSpacing: 'var(--site-letter-heading)',
  lineHeight: 'var(--site-leading-tight)',
});
