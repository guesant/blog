import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';
import { editorialSectionTitleStyles } from '../editorial-typography';

export const LicenseSectionText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { ...editorialSectionTitleStyles, mb: 1.5 },
);
