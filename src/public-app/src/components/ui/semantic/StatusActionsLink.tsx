import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { ExternalLink as BaseComponent } from '@/components/primitives/external-link';

export const StatusActionsLink = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { py: 1 },
);
