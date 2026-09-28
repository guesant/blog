import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const AboutTimelinePeriodText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  paddingTop: 'var(--site-space-1)',
  fontFamily: 'var(--site-font-mono)',
  fontSize: 'var(--site-text-sm)',
  lineHeight: 'var(--site-leading-normal)',
});
