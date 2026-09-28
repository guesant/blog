import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const ReferenceLinkContentFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--site-space-3)',
  minWidth: 0,
  padding: 'var(--site-space-3) var(--site-space-4)',
  color: 'var(--site-text-primary)',
  textDecoration: 'none',
  '&:hover': { backgroundColor: 'var(--site-surface-hover)' },
});
