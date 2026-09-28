import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Chip as BaseComponent } from '@/components/ui/chip';

export const ReferenceLinkContentChip = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  flex: 'none',
  backgroundColor: 'var(--site-accent-bg)',
  color: 'var(--site-primary)',
  fontSize: 'var(--site-text-xs)',
  fontWeight: 'var(--site-weight-semibold)',
  letterSpacing: 'var(--site-letter-label)',
  textTransform: 'uppercase',
});
