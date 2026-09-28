import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Divider as BaseComponent } from '@/components/ui/divider';

export const AboutSectionDividerDivider = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { width: '100%', borderColor: 'var(--site-border)' });
