import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Stack as BaseComponent } from '@/components/ui/stack';

export const ProgressiveSkeletonStack = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { gap: 'var(--site-space-4)', width: '100%' });
