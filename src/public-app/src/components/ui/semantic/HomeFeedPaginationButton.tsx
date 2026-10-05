import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Button as BaseComponent } from '@/components/ui/button';

export const HomeFeedPaginationButton = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  width: 'fit-content',
  minWidth: 0,
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
