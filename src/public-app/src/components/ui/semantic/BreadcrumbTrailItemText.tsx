import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const BreadcrumbTrailItemText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { px: 'var(--site-action-px)', py: 'var(--site-action-py)' });
