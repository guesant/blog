import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';
import { editorialSubsectionTitleStyles } from '../editorial-typography';

export const AboutTimelineTitleText = createSemanticSxComponent<
  ComponentProps<typeof BaseComponent>
>(BaseComponent, editorialSubsectionTitleStyles);
