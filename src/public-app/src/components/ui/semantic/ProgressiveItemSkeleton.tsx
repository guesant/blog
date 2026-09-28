import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Skeleton as BaseComponent } from '@/components/ui/skeleton';

export const ProgressiveItemSkeleton = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { height: 'var(--site-space-12)', width: '100%' });
