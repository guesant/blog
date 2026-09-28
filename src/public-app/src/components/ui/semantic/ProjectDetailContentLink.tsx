import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { ExternalLink as BaseComponent } from '@/components/primitives/external-link';

export const ProjectDetailContentLink = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  fontWeight: 600,
});
