import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import type { ComponentProps } from 'react';
import { BreadcrumbButton } from './BreadcrumbButton';

export const BreadcrumbHomeButton = createSemanticSxComponent<
  ComponentProps<typeof BreadcrumbButton>
>(BreadcrumbButton, {
  padding: 'var(--site-action-py) var(--site-action-px) var(--site-action-py) 0',
});
