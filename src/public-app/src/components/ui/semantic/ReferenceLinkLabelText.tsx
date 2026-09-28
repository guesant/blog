import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const ReferenceLinkLabelText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  fontSize: 'var(--site-text-body)',
  fontWeight: 'var(--site-weight-medium)',
  lineHeight: 'var(--site-leading-tight)',
  overflowWrap: 'anywhere',
});
