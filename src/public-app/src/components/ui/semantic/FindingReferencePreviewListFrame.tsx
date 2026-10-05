import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Box as BaseComponent } from '@/components/ui/box';

export const FindingReferencePreviewListFrame = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { display: 'grid', gap: 'var(--site-space-6)' });
