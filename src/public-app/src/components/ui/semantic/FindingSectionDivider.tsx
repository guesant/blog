import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Divider as BaseComponent } from '@/components/ui/divider';

export const FindingSectionDivider = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { width: '100%' });
