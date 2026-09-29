import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';
import { editorialSectionTitleStyles } from '../editorial-typography';

export const ExperimentsSection2Text = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, { ...editorialSectionTitleStyles, mb: 3 });
