import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const SourcePreviewDescriptionFeedText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  margin: 0,
  width: '100%',
  color: 'var(--site-text-secondary)',
  fontSize: 'var(--site-text-xs)',
  lineHeight: 'var(--site-leading-normal)',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textAlign: 'left',
});
