import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';
import { editorialBodyStyles } from '../editorial-typography';

export const LicenseSection2Text = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  editorialBodyStyles,
);
