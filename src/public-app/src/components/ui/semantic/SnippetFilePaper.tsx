import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Paper as BaseComponent } from '@/components/ui/paper';

export const SnippetFilePaper = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { overflow: 'hidden' },
);
