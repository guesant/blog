import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';
import { editorialSubtitleStyles } from '../editorial-typography';

export const HomeIntroText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { ...editorialSubtitleStyles, display: 'block' },
);
