import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Stack as BaseComponent } from '@/components/ui/stack';

export const StatusActionsStack = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { alignItems: 'flex-start' },
);
