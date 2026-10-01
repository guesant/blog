import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const ReferenceLinkHostText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  color: 'var(--site-text-secondary)',
  fontSize: 'var(--site-text-xs)',
  lineHeight: 'var(--site-leading-normal)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
