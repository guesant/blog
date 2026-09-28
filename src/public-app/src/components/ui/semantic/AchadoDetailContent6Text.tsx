import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const AchadoDetailContent6Text = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { margin: 0, lineHeight: 'var(--site-leading-relaxed)' });
