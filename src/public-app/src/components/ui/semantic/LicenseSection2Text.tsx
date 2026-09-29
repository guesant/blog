import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const LicenseSection2Text = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  { lineHeight: 1.7, textAlign: 'justify', hyphens: 'auto' },
);
