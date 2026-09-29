import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';
import { editorialPageTitleStyles } from '../editorial-typography';

export const HomeHeroTitleText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  editorialPageTitleStyles,
);
