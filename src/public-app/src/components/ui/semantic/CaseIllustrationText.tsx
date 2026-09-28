import type { ComponentProps } from 'react';
import { createSemanticSxComponent } from '@/components/ui/create-semantic-sx-component';
import { Typography as BaseComponent } from '@/components/ui/typography';

export const CaseIllustrationText = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(
  BaseComponent,
  {
    position: 'absolute',
    zIndex: 1,
    right: '1rem',
    bottom: '0.75rem',
    color: 'text.disabled',
  },
);
