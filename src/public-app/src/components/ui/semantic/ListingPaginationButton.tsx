import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Button as BaseComponent } from '@/components/ui/button';

export const ListingPaginationButton = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  justifyContent: 'center',
  minWidth: 'var(--site-control-h-sm)',
  minHeight: 'var(--site-control-h-sm)',
  borderRadius: 0,
  borderColor: 'var(--site-primary)',
  color: 'var(--site-primary)',
  backgroundColor: 'transparent',
  textTransform: 'none',
  '&:hover': {
    borderColor: 'var(--site-primary-hover)',
    color: 'var(--site-primary-hover)',
    backgroundColor: 'var(--site-surface-hover)',
  },
  '&:disabled': {
    borderColor: 'var(--site-border)',
    color: 'var(--site-text-secondary)',
    backgroundColor: 'var(--site-surface-muted)',
  },
});
