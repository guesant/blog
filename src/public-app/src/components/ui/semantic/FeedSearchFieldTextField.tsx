import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { TextField as BaseComponent } from '@/components/ui/text-field';

export const FeedSearchFieldTextField = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { width: 'auto', minWidth: 0, flex: '1 1 auto' });
