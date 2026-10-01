import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const SkipToContentLinkFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  position: 'absolute',
  zIndex: 1500,
  left: 8,
  top: -48,
  px: 2,
  py: 1,
  borderRadius: 0,
  border: 1,
  borderColor: 'var(--site-border)',
  bgcolor: 'var(--site-surface)',
  color: 'var(--site-text-primary)',
  textDecoration: 'none',
  transition: 'top .15s ease-out',
  '&:focus-visible': { top: 8 },
});
