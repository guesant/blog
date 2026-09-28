import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const RichTextPlainParagraphText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  margin: 0,
  color: 'text.primary',
  fontSize: 'var(--site-text-body)',
  lineHeight: 'var(--site-leading-relaxed)',
  textAlign: 'justify',
  hyphens: 'auto',
});
