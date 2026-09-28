import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { ExternalLink as BaseComponent } from '@/components/primitives/external-link';

export const CreditEntryItemLink = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { fontWeight: 700 },
);
