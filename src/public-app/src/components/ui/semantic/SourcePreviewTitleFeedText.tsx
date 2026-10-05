import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const SourcePreviewTitleFeedText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  margin: 0,
  width: '100%',
  color: 'var(--site-text-primary)',
  fontSize: 'var(--site-text-sm)',
  fontWeight: 'var(--site-weight-bold)',
  lineHeight: 'var(--site-leading-tight)',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
});
