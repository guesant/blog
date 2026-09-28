import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const AboutTimelineTitleText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  margin: 0,
  fontFamily: 'var(--site-font-family)',
  fontSize: 'var(--site-text-lg)',
  lineHeight: 'var(--site-leading-tight)',
});
