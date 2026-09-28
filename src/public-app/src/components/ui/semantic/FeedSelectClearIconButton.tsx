import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { IconButton as BaseComponent } from '@/components/ui/icon-button';

export const FeedSelectClearIconButton = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { padding: 'var(--site-space-1)' });
