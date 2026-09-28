import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Stack as BaseComponent } from '@/components/ui/stack';

export const ContentFeedStatusStack = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { alignItems: 'center', mb: 'var(--site-space-4)' });
