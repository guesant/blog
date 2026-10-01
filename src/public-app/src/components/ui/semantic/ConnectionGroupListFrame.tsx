import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const ConnectionGroupListFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { display: 'flex', flexDirection: 'column', gap: 'var(--site-space-4)' });
