import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const ProjectDetailContent2Text = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { mb: 4 });
