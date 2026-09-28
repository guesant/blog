import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Stack as BaseComponent } from '@/components/ui/stack';

export const ContentFeedEmptyStack = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { alignItems: 'center', gap: 'var(--site-space-4)' });
