import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const AboutEditorialSectionTitleText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  margin: 0,
  fontFamily: 'var(--site-font-family)',
  fontSize: 'var(--site-text-2xl)',
  lineHeight: 'var(--site-leading-tight)',
});
